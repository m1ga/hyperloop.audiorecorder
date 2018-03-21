const Context = require("android.content.Context");
const Inflater = require("android.view.LayoutInflater");
const Activity = require("android.app.Activity");
const RecordView = require("com.devlomi.record_view.RecordView");
const RecordButton = require("com.devlomi.record_view.RecordButton");
const OnRecordListener = require("com.devlomi.record_view.OnRecordListener");
const MediaRecorder = require("android.media.MediaRecorder");
const MediaPlayer = require("android.media.MediaPlayer");
const Environment = require("android.os.Environment");
const activity = new Activity(Ti.Android.currentActivity);
const path = Environment.getExternalStorageDirectory().getAbsolutePath();

// get the layout and inflate the view
const inflater = Inflater.cast(activity.getApplicationContext().getSystemService(Context.LAYOUT_INFLATER_SERVICE));
const resID = activity.getResources().getIdentifier('main_content', 'layout', activity.getPackageName());
const view = inflater.inflate(resID, null);

// get the buttons
const recordView = RecordView.cast(view.findViewById(activity.getResources().getIdentifier('record_view', 'id', activity.getPackageName())));
const recordButton = RecordButton.cast(view.findViewById(activity.getResources().getIdentifier('record_button', 'id', activity.getPackageName())));

// record and play audio
var recorder;
var player;

function startRecording() {
	// start recording
	recorder = new MediaRecorder();
	recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
	recorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);
	recorder.setAudioEncoder(MediaRecorder.AudioEncoder.HE_AAC);
	recorder.setAudioEncodingBitRate(16);
	recorder.setAudioSamplingRate(44100);
	recorder.setOutputFile(path + "/test.m4a");
	recorder.prepare();
	recorder.start();
}

function stopRecording(playAudio) {
	try {
		// stop recording
		recorder.stop();
		recorder.reset();
		recorder.release();
	} catch (e) {

	}

	if (playAudio) {
		// play the file
		player = new MediaPlayer();
		player.setDataSource(path + "/test.m4a");
		player.prepare();
		player.start();
	}
}

recordButton.setRecordView(recordView);
recordView.setOnRecordListener(new OnRecordListener({
	onStart: function() {
		console.log("start");
		startRecording();
	},
	onCancel: function() {
		console.log("cancel");
		stopRecording();
	},
	onFinish: function() {
		console.log("end");
		stopRecording(true);
	},
	onLessThanSecond: function() {
		console.log("< 1 sek");
		stopRecording();
	}
}));

$.index.add(view);
$.index.open();
