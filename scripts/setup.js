var jsPsych = initJsPsych(
    /**
    {
        on_finish: function() {
            jsPsych.data.get().localSave('csv', experiment_file);
        },
    } 
    */  
);

const experiment_name = "Flanker Task";
const experiment_short_name = "flanker_task";
var init_date = new Date();
    jsPsych.data.addProperties({
        date: ("0" + init_date.getDate()).slice(-2) + '_' + ("0" + (init_date.getMonth() + 1)).slice(-2) + '_' + init_date.getFullYear(),
        time: init_date.getHours() + "_" + init_date.getMinutes() + "_" + init_date.getSeconds(),
    });

var init_time = init_date.getFullYear() + "_" + (init_date.getMonth() + 1) + "_" + init_date.getDate() + "_" + init_date.getHours() + "_" + init_date.getMinutes() + "_" + init_date.getSeconds()
var timeline = [];

const n_trials = 10;
const n_blocks = 2;
const n_practice = 20;
const n_letter_combinations = 2;
const possible_response_keys = ["d", "l"];
const possible_stimuli = ["MN", "EF", "OQ", "VU", "IT", "PR"];

const trial_duration = 1000;
const stim_duration = 200;
const feedback_dur = 400;
const rsi_duration = 500;

// Remove later
const subject_number = 1;

// record the condition assignment in the jsPsych data
// this adds a property called 'subject' and a property called 'condition' to every trial
jsPsych.data.addProperties({
  subject: subject_number,
});

const experiment_file = "data/" + experiment_short_name + "_" + subject_number + "_" + init_time + ".csv"
console.log(experiment_file)