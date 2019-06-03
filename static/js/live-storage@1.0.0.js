/**
 * This module defines a live storage object that maintains an up-to-date
 * representation of chrome.storage user data. 
 */
const LiveStorage = (() => {
    let updating = false; // flag to avoid infinite call stack when saving data
    const listeners = {};
    const storage = {
        sync: buildStorageProxy('sync'),
        local: buildStorageProxy('local'),
        managed: buildStorageProxy('managed')
    };

    /**
     * Adds a listener that calls a given callback when a given key's value
     * changes.
     * 
     * @param {String} key The key to listen for changes on.
     * @param {Function} callback The function to call when the key's value
     *                            changes.
     * @param {Object} options The optional options:
     *  * area {String} The name of the storage area to apply this listener to.
     *  * onLoad {Boolean} true to run when populating data in #load().
     */
    function addListener(key, callback, options={}) {
        if (!(key in listeners)) {
            listeners[key] = [];
        }
        listeners[key].push({ callback, options });
    }

    /**
     * Removes the given callback bound to a given key.
     * 
     * @param {String} key The key to remove the callback from.
     * @param {Function} callback The callback to remove.
     * @param {Object} options Optional options:
     *  * area {String} The storage area that the callback is bound to.
     */
    function removeListener(key, callback, options) {
        if (key in listeners) {
            listeners[key] = listeners[key].filter(listener => {
                if (options.area && options.area !== listener.areaName) {
                    return false;
                }
                return listener.callback !== callback;
            });
        }
    }

    /**
     * Updates the local storage object and calls applicable listeners.
     * 
     * @param {Object} changes The changes to apply.
     * @param {String} areaName The name of the area to apply changes to.
     */
    function update(changes, areaName) {
        // identify changes
        let added = {};
        let removedKeys = [];
        for (let key in changes) {
            if ('newValue' in changes[key]) {
                added[key] = changes[key].newValue;
                changes[key].value = changes[key].newValue;
            } else {
                removedKeys.push(key);
            }
        }
        // apply changes
        updating = true;
        Object.assign(storage[areaName], added);
        for (let key of removedKeys) {
            delete storage[areaName][key];
        }
        updating = false;
        // call listeners after updating storage objects
        for (let key in changes) {
            if (key in listeners) {
                callListeners(key, changes[key], areaName, false);
            }
        }
    }

    function callListeners(key, change, areaName, isLoad) {
        for (let listener of listeners[key]) {
            if (isLoad && !listener.options.onLoad) {
                continue;
            }
            if (listener.options.area && listener.options.area !== areaName) {
                continue;
            }
            listener.callback(change);
        }
    }

    /**
     * Async loads data from chrome.storage and calls applicable callbacks.
     * 
     * @param {Object} areas The areas to load data into, where the keys are
     *                       area names and values are booleans.
     *                       Defaults to load all three: sync, local, managed.
     */
    async function load(areas={}) {
        let defaults = { sync: true, local: true, managed: true };
        let requests = [];
        for (let area in defaults) {
            requests.push(new Promise((resolve, reject) => {
                let shouldFetch = area in areas ? areas[area] : defaults[area];
                if (shouldFetch) {
                    chrome.storage[area].get(null, items => {
                        if (chrome.runtime.lastError) {
                            reject(chrome.runtime.lastError.message);
                        }
                        resolve({ area, items });
                    });
                } else {
                    resolve({ area, items: {} });
                }
            }));
        }
        return Promise.all(requests).then(results => {
            chrome.storage.onChanged.addListener(update);
            // add loaded data into storage objects
            updating = true;
            for (let result of results) {
                Object.assign(storage[result.area], result.items);
            }
            updating = false;
            // call listeners after updating storage objects
            for (let area in storage) {
                for (let key in storage[area]) {
                    if (key in listeners) {
                        let change = { value: storage[area][key] };
                        callListeners(key, change, area, true);
                    }
                }
            }
        });
    }

    /**
     * Creates a storage data object proxy that calls chrome.storage functions
     * when modifying storage data. This proxy also enforces read-only access
     * for the "managed" chrome.storage area.
     * 
     * @param {String} areaName The area name of the wrapped storage object.
     */
    function buildStorageProxy(areaName) {
        return new Proxy({}, {
            set: (store, key, value) => {
                checkManaged(areaName);
                let prev = store[key];
                store[key] = value;
                if (!updating) {
                    chrome.storage[areaName].set({ [key]: value }, () => {
                        checkError('set', areaName, key, value, prev);
                    });
                }
                return true;
            },
            deleteProperty: (store, key) => {
                checkManaged(areaName);
                let prev = store[key];
                delete store[key];
                if (!updating) {
                    chrome.storage[areaName].remove(key, () => {
                        checkError('remove', areaName, key, undefined, prev);
                    });
                }
                return true;
            }
        });
    }

    /**
     * Checks if a chrome.runtime error occurred and if so, reverts the live
     * storage to undo the change on which the error occurred. This function
     * also calls onError, passing the error message and error content info.
     * 
     * @param {String} action The action during which the error occurred.
     * @param {String} area The name of the storage area used in the action.
     * @param {String} key The key used in the action.
     * @param {Any} value The value used in the action.
     * @param {Any} previousValue The previous value, to revert the value to.
     */
    function checkError(action, area, key, value, previousValue) {
        if (chrome.runtime.lastError) {
            updating = true;
            storage[area][key] = previousValue;
            updating = false;
            let info = { action, area, key, value, previousValue };
            onError(chrome.runtime.lastError.message, info);
        }
    }

    /**
     * Checks if the given area is the read-only chrome.storage.managed area.
     */
    function checkManaged(areaName) {
        if (areaName === 'managed') {
            throw new Error('chrome.storage.managed is read-only');
        }
    }

    /**
     * Handles errors that occur in chrome.storage set/remove function calls.
     * This function should be defined to supply users with meaningful error
     * messages. The default implementation shows a console warning.
     * 
     * @param {String} message The message from `chrome.runtime.lastError`.
     * @param {Object} info Info containing the area, key, and value for which
     *                      the error occurred. Use these values to plan how to
     *                      avoid the error during future invocations.
     */
    function onError(message, info) {
        console.warn(message, info);
    }

    /**
     * The LiveStorage public contract, with unmodifiable storage objects.
     * The explicit onError get/set functions are required due to module scope.
     */
    return {
        load,
        addListener,
        removeListener,
        get sync() { return storage.sync; },
        get local() { return storage.local; },
        get managed() { return storage.managed; },
        get onError() { return onError },
        set onError(fn) { onError = fn }
    }
})();