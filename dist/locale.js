var lang = document.getElementsByTagName("html")[0].getAttribute("lang");
var locale = {
	en: {
		CAR_CONTROLS: 'Car controls',
		DRAG_CAMERA: 'Drag camera',
		SCROLL_ZOOM: 'Scroll zoom',
		TILT: 'Tilt',
		VR_STEERING: 'VR Mode',
		VR_CAMERA: 'VR Orbit',
		EXIT_VR: 'Exit VR',
		FULLSCREEN: 'Fullscreen',
		EXIT_FULLSCREEN: 'Exit',
		INTRO_HEADER: 'Car VR Test Ride',
		BUILDING_CAR: 'Building car...',
		TAP_TO_BEGIN: 'Tap screen to begin.',
		LOADING_ASSETS: 'Loading assets...',
		BROWSER_BAD: 'Your browser does not provide<br>3D support.',
		BUTTON_GALLERY: 'Go to Car Gallery',
	}
};
var translations = locale[lang];