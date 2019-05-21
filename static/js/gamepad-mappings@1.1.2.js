/**
 * Minified by jsDelivr using Terser v3.14.1.
 * Original file: /gh/FThompson/gamepads.js@1.1.1/gamepad-mappings.js
 * 
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
const PS3Mapping={name:"PS3",filePrefix:"PS3_",buttons:["Cross","Circle","Square","Triangle","L1","R1","L2","R2","Select","Start","Left_Stick","Right_Stick","Dpad_Up","Dpad_Down","Dpad_Left","Dpad_Right"]},PS4Mapping={name:"PS4",filePrefix:"PS4_",buttons:["Cross","Circle","Square","Triangle","L1","R1","L2","R2","Share","Options","Left_Stick","Right_Stick","Dpad_Up","Dpad_Down","Dpad_Left","Dpad_Right"]},Xbox360Mapping={name:"Xbox 360",filePrefix:"360_",buttons:["A","B","X","Y","LB","RB","LT","RT","Back","Start","Left_Stick","Right_Stick","Dpad_Up","Dpad_Down","Dpad_Left","Dpad_Right"]},XboxOneMapping={name:"Xbox One",filePrefix:"XboxOne_",buttons:["A","B","X","Y","LB","RB","LT","RT","Windows","Menu","Left_Stick","Right_Stick","Dpad_Up","Dpad_Down","Dpad_Left","Dpad_Right"]},ALL_MAPPINGS=[PS3Mapping,PS4Mapping,Xbox360Mapping,XboxOneMapping];class _GamepadButton{constructor(t,a,n){this.mappingName=t,this.buttonName=a,this.buttonImageSrc=n}}class GamepadMappingHandler{constructor(){if(GamepadMappingHandler._instance)return GamepadMappingHandler._instance;this.buttonsPath="/buttons",this.mappings={};for(let t of ALL_MAPPINGS)this.mappings[t.name]=t;GamepadMappingHandler._instance=this}getButton(t,a){if(t in this.mappings&&a in this.mappings[t].buttons){let n=this.mappings[t].buttons[a],i=this.mappings[t].filePrefix+n+".png",p=this.buttonsPath+"/"+t+"/"+i;return new _GamepadButton(t,n,p)}return null}}const gamepadMappings=new GamepadMappingHandler;
//# sourceMappingURL=/sm/230f86e7895237ff20e30d93aa4737464954ec2751d25856a52cc3dd8feeeec7.map