gamepads.addEventListener('connect', (gamepad) => {
    console.log('gamepad connected')
    console.log(gamepad)
    gamepad.addEventListener('buttonrelease', (i) => {
        console.log('released button ' + i)
    })
})
gamepads.start()