var NUMBER_SQUARES_IN_A_ROW = 15;
var NUMBER_SQUARES_IN_A_COLUMN = 10;
var NUMBER_OF_BOMBS = 20;
var map_board = [];
var is_first_click = true;
var game_state = "Playing...";
var board_state = [];
var information_game = {
    player_name: "Lucky",
    board_dimension: NUMBER_SQUARES_IN_A_ROW + "x" + NUMBER_SQUARES_IN_A_COLUMN,
    bomb_numbers: NUMBER_OF_BOMBS,
    state_game: game_state
}
var leader_board = {
    player_name: "Lucky",
    board_dimension: NUMBER_SQUARES_IN_A_ROW + "x" + NUMBER_SQUARES_IN_A_COLUMN,
    bomb_numbers: NUMBER_OF_BOMBS,
    state_game: game_state,
    total_time: 10,
    date: 0
}





function create_squares(number_squares_in_a_row, number_squares_in_a_column) {

    /************************************Create the container contain squares******************************/
    let width_length = 0;
    let height_length = 0;
    let big_or_small = "big";

    //Checking if the squares should be big or small
    if ((number_squares_in_a_row > 15 && number_squares_in_a_row < 20) ||
        (number_squares_in_a_column > 11 && number_squares_in_a_column < 15)) {
        big_or_small = "normal";
    } else if (number_squares_in_a_row >= 20 || number_squares_in_a_column >= 15) {
        big_or_small = "small";
    }

    //Set the length for container containing squares
    if (big_or_small === "big") {
        width_length = 54 * number_squares_in_a_row;
        height_length = 54 * number_squares_in_a_column;
    } else if (big_or_small === "normal") {
        width_length = 39 * number_squares_in_a_row;
        height_length = 39 * number_squares_in_a_column;
    } else {
        width_length = 29 * number_squares_in_a_row;
        height_length = 29 * number_squares_in_a_column;
    }


    /************************************Create the squares******************************/
    let content = '<div class="d-flex justify-content-center flex-wrap" style="width: ' + width_length +
        'px; height:' + height_length + 'px;" id="board">' + '</div>';

    $("#boundary").append(content);



    //Create the squares
    let number_of_squares = number_squares_in_a_row * number_squares_in_a_column;
    content = ""; //Reset the content
    for (let i = 0; i < number_of_squares; i++) {
        if (big_or_small === "big") {
            content = content + '<div class="hoverable" style="width: 50px; height:50px;" id="' + i +
                '"></div>';
        } else if (big_or_small === "normal") {
            content = content + '<div class="hoverable" style="width: 35px; height:35px;" id="' + i +
                '"></div>';
        } else {
            content = content + '<div class="hoverable" style="width: 25px; height:25px;" id="' + i +
                '"></div>';
        }

    }

    $("#board").append(content);

}


function set_background_for_each_square(id, number) {
    id = "#" + id;
    if (number !== -1) {
        $(id).addClass("number_" + number);
    } else {
        $(id).addClass("bomb");
    }
}


function set_background_for_all(max_number_of_bomb, must_not_bomb) { //Just run it after the user click for the first time

    let number_of_bomb = 0;

    let arr = [];
    for (let i = 0; i < NUMBER_SQUARES_IN_A_ROW * NUMBER_SQUARES_IN_A_COLUMN; i++) {
        arr[i] = 0;
    }


    let check_duplicate_bomb = [];
    for (let i = 0; i < max_number_of_bomb; i++) {



        let number = Math.floor(Math.random() * NUMBER_SQUARES_IN_A_ROW * NUMBER_SQUARES_IN_A_COLUMN);
        let duplicate_bomb = true;
        let is_duplicate_for_loop = false;


        //Handle for initialize - First click must not encounter bombs - Part 1
        //We need part 2 because when handle for duplicate bomb, the value of bomb can be violate the first click again
        while (true) {
            let count_encounter_bomb = 0;
            for (let k = 0; k < must_not_bomb.length; k++) {
                if (number === must_not_bomb[k]) {
                    number = Math.floor(Math.random() * NUMBER_SQUARES_IN_A_ROW * NUMBER_SQUARES_IN_A_COLUMN);
                    count_encounter_bomb++;
                    break;
                }
            }
            if (count_encounter_bomb === 0) {
                break;
            }
        }


        //Handle for duplicate bomb
        while (duplicate_bomb === true) {
            is_duplicate_for_loop = false;
            for (let j = 0; j <= check_duplicate_bomb.length; j++) {
                if (number === check_duplicate_bomb[j]) {
                    number = Math.floor(Math.random() * NUMBER_SQUARES_IN_A_ROW * NUMBER_SQUARES_IN_A_COLUMN);


                    //Handle for initialize - First click must not encounter bombs - Part 2
                    while (true) {
                        let count_encounter_bomb = 0;
                        for (let k = 0; k < must_not_bomb.length; k++) {
                            if (number === must_not_bomb[k]) {
                                number = Math.floor(Math.random() * NUMBER_SQUARES_IN_A_ROW * NUMBER_SQUARES_IN_A_COLUMN);
                                count_encounter_bomb++;
                                break;
                            }
                        }
                        if (count_encounter_bomb === 0) {
                            break;
                        }
                    }


                    is_duplicate_for_loop = true;
                    break;
                }
            }

            if (is_duplicate_for_loop) {
                continue;
            }

            duplicate_bomb = false;
        }


        arr[number] = -1;
        check_duplicate_bomb[i] = number;

        //Trùng bomb


    }

    for (let pointer = 0; pointer < NUMBER_SQUARES_IN_A_ROW * NUMBER_SQUARES_IN_A_COLUMN; pointer++) {
        let how_many_bomb = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let relative_number = pointer + NUMBER_SQUARES_IN_A_ROW * i + j;
                if (relative_number >= 0 && relative_number < NUMBER_SQUARES_IN_A_ROW * NUMBER_SQUARES_IN_A_COLUMN) {

                    if ((pointer % NUMBER_SQUARES_IN_A_ROW === 0) && (j === -1)) {
                        //Prevent bug when user click at the left boundary of the board
                    } else if ((pointer % NUMBER_SQUARES_IN_A_ROW === (NUMBER_SQUARES_IN_A_ROW - 1)) && (j === 1)) {
                        //Prevent bug when user click at the right boundary of the board
                    } else {
                        if (arr[relative_number] === -1) {
                            how_many_bomb++;
                        }
                    }
                }
            }
        }
        if (arr[pointer] !== -1) {
            arr[pointer] = how_many_bomb;
        }
    }

    for (let i = 0; i < NUMBER_SQUARES_IN_A_ROW * NUMBER_SQUARES_IN_A_COLUMN; i++) {
        set_background_for_each_square(i, arr[i]);
    }

}


function generate_map() {

    for (let i = 0; i < NUMBER_SQUARES_IN_A_COLUMN; i++) {
        map_board[i] = [];
    }
    for (let i = 0; i < NUMBER_SQUARES_IN_A_COLUMN; i++) {
        for (let j = 0; j < NUMBER_SQUARES_IN_A_ROW; j++) {
            let id = "#" + (i * NUMBER_SQUARES_IN_A_ROW + j);
            let state = $(id).attr("class");
            if (state.includes("number_0")) {
                map_board[i][j] = 0;
            } else if (state.includes("number_1")) {
                map_board[i][j] = 1;
            } else if (state.includes("number_2")) {
                map_board[i][j] = 2;
            } else if (state.includes("number_3")) {
                map_board[i][j] = 3;
            } else if (state.includes("number_4")) {
                map_board[i][j] = 4;
            } else if (state.includes("number_5")) {
                map_board[i][j] = 5;
            } else if (state.includes("number_6")) {
                map_board[i][j] = 6;
            } else if (state.includes("number_7")) {
                map_board[i][j] = 7;
            } else if (state.includes("number_8")) {
                map_board[i][j] = 8;
            } else if (state.includes("number_9")) {
                map_board[i][j] = 9;
            } else if (state.includes("bomb")) {
                map_board[i][j] = -1;
            }
        }
    }
}


/******************************************* Handle click event****************************************************/
function reveal_square(id_number) {
    let id = parseInt(id_number);

    if (is_first_click) {
        is_first_click = false;

        //Initialize the map
        let must_not_bomb = relative_3x3_squares(id_number);
        set_background_for_all(NUMBER_OF_BOMBS, must_not_bomb);
        generate_map();
        time_counter();

        reveal_3x3_squares(id_number);

    } else {
        id = "#" + id;

        $(id).removeClass("hoverable");
        $(id).addClass("active");

        if ($(id).attr("class").includes("number_0")) {
            reveal_all_empty_squares(parseInt(id_number));
        }
    }
}

/*function reveal_square(id_number) {
    let id = parseInt(id_number);
    id = "#" + id;

    $(id).removeClass("hoverable");
    $(id).addClass("active");

    if($(id).attr("class").includes("number_0")){
        reveal_all_empty_squares(parseInt(id_number));
    }
    
}*/

function reveal_3x3_squares(id_number_center) {
    let squares_reveal = relative_3x3_squares(id_number_center);

    for (let i = 0; i < squares_reveal.length; i++) {
        //Condition
        let id_query_temp = "#" + squares_reveal[i];
        if ($(id_query_temp).attr("class").includes("active") || $(id_query_temp).attr("class").includes("flag_on")) {

        } else {
            reveal_square(squares_reveal[i]);
            if ($(id_query_temp).attr("class").includes("number_0")) {
                reveal_all_empty_squares(squares_reveal[i]);
            }
        }
    }


}

function reveal_all_relative_squares(id_number_center) {
    let squares_reveal = all_relative_squares(id_number_center);
    for (let i = 0; i < squares_reveal.length; i++) {
        //Condition
        let id_query_temp = "#" + squares_reveal[i];
        if ($(id_query_temp).attr("class").includes("active") || $(id_query_temp).attr("class").includes("flag_on")) {

        } else {
            reveal_square(squares_reveal[i]);
        }
    }
}


function reveal_all_empty_squares(id_number_center) {
    let squares_reveal = boundary_squares_and_empty_squares(id_number_center);
    for (let i = 0; i < squares_reveal.length; i++) {
        //Condition
        let id_query_temp = "#" + squares_reveal[i];
        if ($(id_query_temp).attr("class").includes("active") || $(id_query_temp).attr("class").includes("flag_on")) {

        } else {
            reveal_square(squares_reveal[i]);
        }
    }
}


/*********************************************** Handle relative squares *****************************************/
function relative_3x3_squares(id_number_center) {
    id_number_center = parseInt(id_number_center);

    let position_row_direction_center = id_number_center % NUMBER_SQUARES_IN_A_ROW;
    let position_column_direction_center = (id_number_center - position_row_direction_center) / NUMBER_SQUARES_IN_A_ROW;

    let results = [];

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let position_row_direction = position_row_direction_center + i;
            let position_column_direction = position_column_direction_center + j;

            if (position_row_direction >= 0 && position_row_direction < NUMBER_SQUARES_IN_A_ROW) {
                if (position_column_direction >= 0 && position_column_direction < NUMBER_SQUARES_IN_A_COLUMN) {
                    results.push(position_column_direction * NUMBER_SQUARES_IN_A_ROW + position_row_direction);
                }
            }
        }
    }

    return results;
}


function all_empty_squares(id_number_center) {
    let checked_positions = [parseInt(id_number_center)];
    //let index_checked = 0;

    function push_all_3x3_squares(arr) {
        for (let i = 0; i < arr.length; i++) {
            let is_duplicate = false;
            for (let j = 0; j < checked_positions.length; j++) {
                if (checked_positions[j] === arr[i]) {
                    is_duplicate = true;
                    break;
                }
            }
            if (is_duplicate === false) {
                let id_query = "#" + arr[i];
                if ($(id_query).attr("class").includes("number_0")) {
                    if ($(id_query).attr("class").includes("flag_on")) {

                    } else {
                        checked_positions.push(arr[i]);
                    }

                }
            }
        }
    }


    for (let index_checked = 0; index_checked < checked_positions.length; index_checked++) {
        push_all_3x3_squares(relative_3x3_squares(checked_positions[index_checked]));
    }

    return checked_positions;
}

function boundary_squares_and_empty_squares(id_number_center) {
    let checked_positions = all_empty_squares(id_number_center);
    let old_length = checked_positions.length;


    function push_all_3x3_squares(arr) {
        for (let i = 0; i < arr.length; i++) {
            let is_duplicate = false;
            for (let j = 0; j < checked_positions.length; j++) {
                if (checked_positions[j] === arr[i]) {
                    is_duplicate = true;
                    break;
                }
            }
            if (is_duplicate === false) {
                checked_positions.push(arr[i]);
            }
        }
    }

    for (let index_checked = 0; index_checked < old_length; index_checked++) {
        push_all_3x3_squares(relative_3x3_squares(checked_positions[index_checked]));
    }

    return checked_positions;
}


/*function all_relative_squares(id_number_center) {
    let checked_positions = [parseInt(id_number_center)];
    //let index_checked = 0;

    function push_all_3x3_squares(arr) {
        for (let i = 0; i < arr.length; i++) {
            let is_duplicate = false;
            for (let j = 0; j < checked_positions.length; j++) {
                if (checked_positions[j] === arr[i]) {
                    is_duplicate = true;
                    break;
                }
            }
            if (is_duplicate === false) {
                checked_positions.push(arr[i]);
            }
        }
    }


    for (let index_checked = 0; index_checked < checked_positions.length; index_checked++) {
        push_all_3x3_squares(relative_3x3_squares(checked_positions[index_checked]));
    }

    return checked_positions;
}*/

/****************************************** Handle win or lose! ********************************************/
function check_win_or_lose() {
    let how_many_unreveal_squares = 0;
    let touch_bomb = 0;

    for (let i = 0; i < NUMBER_SQUARES_IN_A_ROW * NUMBER_SQUARES_IN_A_COLUMN; i++) {
        let id_query = "#" + i;
        if ($(id_query).attr("class").includes("active")) {
            if ($(id_query).attr("class").includes("bomb")) {
                touch_bomb++;
                game_state = "Lose";

                $("#state_played").text("You lose!");
                activate_modal_2();

                export_leader_board();
                upload_leaderboard_to_database();
                //alert("You lose!");
                break;
            }
        } else {
            how_many_unreveal_squares++;
        }
    }

    if ((how_many_unreveal_squares <= NUMBER_OF_BOMBS) && touch_bomb === 0) {
        game_state = "Win";

        $("#state_played").text("You win!");
        activate_modal_2();

        export_leader_board();
        upload_leaderboard_to_database();
        //alert("You win!");
    }


}

/****************************************** Time counter ***************************************************/
function time_counter() {
    if (game_state === "Playing..." && is_first_click === false) {
        let time = new Date();
        let start_time = time.getTime();
        let start_minute = time.getMinutes();
        let start_second = time.getSeconds();

        let interval_time_id = setInterval(myFunction, 1000);

        function myFunction() {
            let now = new Date();
            if (game_state !== "Playing...") {
                clearInterval(interval_time_id);
            }
            /*document.getElementById("time_panel").innerHTML =
                (now.getMinutes() - start_minute) + ":" +
                (now.getSeconds() - start_second);*/

            /*document.getElementById("time_panel").innerHTML =
                (now.getTime() - time.) + ":" +
                (now.getSeconds() - start_second);*/
            let output_time = convert_seconds_to_minute_second(parseInt((now.getTime() - time.getTime()) / 1000));
            document.getElementById("time_panel").innerHTML = output_time;

        }
    }
}

function convert_seconds_to_minute_second(second_elapsed) {
    let second = second_elapsed % 60;
    let minute = parseInt(second_elapsed / 60);
    let output_time = "";
    if (minute < 10) {
        output_time = output_time + "0" + minute + ":";
    } else {
        output_time = output_time + minute + ":";
    }

    if (second < 10) {
        output_time = output_time + "0" + second;
    } else {
        output_time = output_time + second;
    }

    return output_time;
}

/****************************************** Store board state (Support "Undo") *************************************/
function update_board_state() {

    if (is_first_click) {

    } else {
        let state_temp = [];
        for (let i = 0; i < NUMBER_SQUARES_IN_A_ROW * NUMBER_SQUARES_IN_A_COLUMN; i++) {
            let id_query = "#" + i;
            state_temp.push($(id_query).attr("class"));
        }

        board_state.push(state_temp);
    }


}

function undo_state() {

    board_state.pop();



    for (let i = 0; i < NUMBER_SQUARES_IN_A_ROW * NUMBER_SQUARES_IN_A_COLUMN; i++) {
        let id_query = "#" + i;
        $(id_query).removeClass();
        $(id_query).addClass(board_state[board_state.length - 1][i]);
    }
    active_undo_button();

}

function active_undo_button() {
    if (board_state.length <= 1 || game_state === "Lose" || game_state === "Win") {
        $("#undo_button").prop("disabled", true);
    } else {
        $("#undo_button").prop("disabled", false);
    }
}

//When user click at the opened squares, it should not update into stack
function avoid_fake_update(number_id) {
    //let number_id = parseInt(number_id);

    let surrounding_3x3 = relative_3x3_squares(number_id);
    let is_need_to_update = true;
    let number_of_active_squares = 0;
    if (board_state.length >= 1) {
        for (let i = 0; i < surrounding_3x3.length; i++) {
            let id_query = "#" + surrounding_3x3[i];
            if ($(id_query).attr("class") === board_state[board_state.length - 1][surrounding_3x3[i]]) {
                number_of_active_squares++;
            }
        }
        if (number_of_active_squares >= surrounding_3x3.length) {
            is_need_to_update = false;
        }
    }


    return is_need_to_update;
}

/***************************************** Handle Status ***************************************************/
function update_status() {
    update_status_data();

    $("#player_name").text(information_game.player_name + "");
    $("#board_dimension").text(information_game.board_dimension + "");
    $("#bomb_numbers").text(information_game.bomb_numbers + "");
    $("#state_game").text(information_game.state_game + "");

}

function update_status_data() {
    information_game.state_game = game_state;
}

/******************************************* Update global board *******************************************/
function update_global_board(row_length, column_length, bombs, name) {
    row_length = parseInt(row_length);
    column_length = parseInt(column_length);
    bombs = parseInt(bombs);

    NUMBER_SQUARES_IN_A_ROW = row_length;
    NUMBER_SQUARES_IN_A_COLUMN = column_length;
    NUMBER_OF_BOMBS = bombs;

    information_game.player_name = name;
    information_game.board_dimension = NUMBER_SQUARES_IN_A_ROW + "x" + NUMBER_SQUARES_IN_A_COLUMN;
    information_game.bomb_numbers = NUMBER_OF_BOMBS;
}


/****************************************** Post data ******************************************************/
function post_board(info_json) {
    fetch('/game_request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            info_json
        }),
    }).then(function () {
        window.location.replace("/game");
    });



}

/****************************************** Initialize board ***********************************************/
function initialize_board() {
    NUMBER_SQUARES_IN_A_ROW = parseInt($("#number_of_squares_a_row").text());
    NUMBER_SQUARES_IN_A_COLUMN = parseInt($("#number_of_squares_a_column").text());
    NUMBER_OF_BOMBS = parseInt($("#number_of_bombs").text());

    information_game.player_name = $("#user_name").text();
    information_game.board_dimension = NUMBER_SQUARES_IN_A_ROW + "x" + NUMBER_SQUARES_IN_A_COLUMN;
    information_game.bomb_numbers = NUMBER_OF_BOMBS;
    information_game.state_game = "Playing...";

    //Delete the html elements
    $("#number_of_squares_a_row").remove();
    $("#number_of_squares_a_column").remove();
    $("#number_of_bombs").remove();
    $("#user_name").remove();
}

/****************************************** Leaderboaard ***************************************************/
function export_leader_board() {
    leader_board.player_name = information_game.player_name;
    leader_board.board_dimension = information_game.board_dimension;
    leader_board.bomb_numbers = information_game.bomb_numbers;
    leader_board.state_game = game_state;

    //Get date
    let d = new Date();
    let date = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
    leader_board.date = date;


    //Get timeplay
    let time_elapse_str = $("#time_panel").text();
    let minute = parseInt(time_elapse_str.charAt(0) + time_elapse_str.charAt(1));
    let second = parseInt(time_elapse_str.charAt(3) + time_elapse_str.charAt(4));
    leader_board.total_time = minute * 60 + second;

    /*if(minute === "null" || second==="null" || leader_board.total_time==="null"){
        leader_board.total_time = 0;
    }*/

}

function get_data_leaderboard() {
    fetch('/leaderboard', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => res.json())
        .then(json => {
            console.log(json);
            export_json(json);
        });
}

function export_json(json) {
    //alert(json[0].player_name);


    $("#leaderboard_body").empty();

    let content = '';

    for (let i = 0; i < json.length; i++) {
        content = content + '<tr>'

        content = content + '<td>' + json[i].player_name + '</td>';
        content = content + '<td>' + json[i].board_dimension + '</td>';
        content = content + '<td>' + json[i].bomb_numbers + '</td>';
        content = content + '<td>' + json[i].time_play + '</td>';
        content = content + '<td>' + json[i].state_game + '</td>';
        content = content + '<td>' + json[i].total_time + '</td>';

        content = content + '</tr>';
    }

    $("#leaderboard_body").append(content);

    activate_modal();
}

function upload_leaderboard_to_database() {

    if (leader_board.player_name !== "") {
        fetch('/leaderboard_upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                leader_board
            }),
        }).then(function () {

        });
    }
}

/****************************************** Calling default function****************************************/

//Max width is 30
initialize_board();
create_squares(NUMBER_SQUARES_IN_A_ROW, NUMBER_SQUARES_IN_A_COLUMN);
active_undo_button();
update_status();