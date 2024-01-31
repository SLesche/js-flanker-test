function get_random_zero_or_one() {
  return Math.round(Math.random());
}
function get_random_samples_from_list(list, n) {
  if (n <= 0 || n > list.length) {
    console.error('Invalid number of samples');
    return [];
  }

  const shuffled_list = [...list].sort(() => Math.random() - 0.5);
  return shuffled_list.slice(0, n);
}

function get_random_letter_from_string(input_string) {
  const random_index = Math.floor(Math.random() * input_string.length);
  return input_string.charAt(random_index);
}

function split_string_into_list(s) {
  // if s is a string, we return a list of its characters
  if (typeof s === 'string')
      return s.split('');
  else
      // otherwise we return s:
      return s;
}

function map_responses_to_letters(subject_number, letter_combinations) {
  const response_mapping = {};

  for (const entry of letter_combinations) {
    const [char1, char2] = entry.split('');

    // Determine responses based on even or odd subject_number
    const response1 = subject_number % 2 === 0 ? 'd' : 'l';
    const response2 = subject_number % 2 === 0 ? 'l' : 'd';

    response_mapping[char1] = response1;
    response_mapping[char2] = response2;
  }

  return response_mapping;
}


function create_flanker_trial(block_possible_stimuli, mapped_responses) {
  const current_letters = get_random_samples_from_list(block_possible_stimuli, 1)[0];
  const current_congruency = Math.round(Math.random());
  const which_central = Math.round(Math.random());
  const central_stimulus = current_letters[which_central];

  if (current_congruency === 1){
    flanking_stimulus = central_stimulus;
  } else {
    flanking_stimulus = current_letters[1 - which_central];
  }

  const correct_response =  mapped_responses[central_stimulus];
  const current_stimulus = flanking_stimulus + flanking_stimulus + central_stimulus + flanking_stimulus + flanking_stimulus

  const trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p class = "flanker-stim">${current_stimulus}</p>`,
    choices: possible_response_keys,
    stimulus_duration: stim_duration,
    trial_duration: trial_duration, // Adjust as needed
    response_ends_trial: true,
    on_finish: function(data) {
      // Record accuracy and congruency
      data.accuracy = data.response === correct_response ? 1 : 0;

      data.current_congruency = current_congruency;
    }
  };

  return trial;
}

function get_block_instruction(mapped_responses){
  var block_instruction_message = "";

  let letter_count = 0;

  for (const letter in mapped_responses) {
    const responseChar = mapped_responses[letter];
    block_instruction_message += `"${letter}" -> ${responseChar}, `;
    
    // Add a newline after every 2 combinations
    if (++letter_count % 2 === 0) {
      block_instruction_message += "<br>";
    }
  }  

  // Remove the trailing comma and space
  block_instruction_message = block_instruction_message.slice(0, -6);

  const block_instruction = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p class = "normal-text">${block_instruction_message}</p>`,
    choices: "ALL_KEYS",
    response_ends_trial: true,
    prompt: "Drücke eine beliebige Taste um fortzufahren."
  };

  return block_instruction
}

function create_fixation_cross(fixation_cross_dur){
  const fixation_cross = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div class = "normal-text">+</div>',
    choices: "NO_KEYS", // No keys allowed during fixation
    trial_duration: fixation_cross_dur, // Duration of fixation in milliseconds
    response_ends_trial: false,
  };

  return fixation_cross;
}

function create_feedback(){
    var feedback = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function(){
        var last_trial_correct = jsPsych.data.get().last(1).values()[0].accuracy;
        if (last_trial_correct) {
          return '<p class = "normal-text"><span style = "color: green">Richtig</span></p>'; 
        } else {
          return '<p class = "normal-text"><span style = "color: red">Falsch</span></p>'; 
        }
      },
      choices: "NO_KEYS", // No keys allowed during fixation
      trial_duration: feedback_dur, // Duration of fixation in milliseconds
      response_ends_trial: false,
      data: "",
  };

  return feedback;
}

for (let iblock = 0; iblock < n_blocks; iblock++){
  var block_stimuli = get_random_samples_from_list(possible_stimuli, n_letter_combinations);
  var mapped_responses = map_responses_to_letters(subject_number, block_stimuli);

  // Instruction screen here
  timeline.push(get_block_instruction(mapped_responses))

  // Practice runs here, with feedback and stim_duration?
  for (let ipractice = 0; ipractice < n_practice; ipractice++){
    const trial = create_flanker_trial(block_stimuli, mapped_responses);
    const feedback = create_feedback();
    const fixation_cross = create_fixation_cross(rsi_duration);
    timeline.push(trial);
    timeline.push(feedback);
    timeline.push(fixation_cross);
  }
  // TODO: screen where people can choose to rerun practice trials#
  
  for (let itrial = 0; itrial < n_trials; itrial++) {
    const trial = create_flanker_trial(block_stimuli, mapped_responses)
    const fixation_cross = create_fixation_cross(rsi_duration);
    timeline.push(trial);
    timeline.push(fixation_cross);
  }

  // Here short self-paced break
}
