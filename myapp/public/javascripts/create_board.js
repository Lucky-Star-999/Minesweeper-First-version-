var NUMBER_SQUARES_IN_A_ROW = 15;
var NUMBER_SQUARES_IN_A_COLUMN = 10;
var NUMBER_OF_BOMBS = 20;
var map_board = [];
var is_first_click = true;
var game_state = "nothing";
var board_state = [];





function create_squares(number_squares_in_a_row, number_squares_in_a_column) {

    /************************************Create the container contain squares******************************/
    let width_length = 0;
    let height_length = 0;
    let big_or_small = "big";

    //Checking if the squares should be big or small
    if (number_squares_in_a_row > 15 /*|| number_squares_in_a_column > 10*/ ) {
        big_or_small = "small";
    }

    //Set the length for container containing squares
    if (big_or_small === "big") {
        width_length = 54 * number_squares_in_a_row;
        height_length = 54 * number_squares_in_a_column;
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
                game_state = "lose";
                alert("You lose!");
                break;
            }
        } else {
            how_many_unreveal_squares++;
        }
    }

    if ((how_many_unreveal_squares <= NUMBER_OF_BOMBS) && touch_bomb === 0) {
        game_state = "win";
        alert("You win!");
    }


}

/****************************************** Time counter ***************************************************/
function time_counter() {
    if (game_state === "nothing" && is_first_click === false) {
        let time = new Date();
        let start_time = time.getTime();
        let start_minute = time.getMinutes();
        let start_second = time.getSeconds();

        let interval_time_id = setInterval(myFunction, 1000);

        function myFunction() {
            let now = new Date();
            /*document.getElementById("time_panel").innerHTML =
                (now.getMinutes() - start_minute) + ":" +
                (now.getSeconds() - start_second);*/

            /*document.getElementById("time_panel").innerHTML =
                (now.getTime() - time.) + ":" +
                (now.getSeconds() - start_second);*/
            document.getElementById("time_panel").innerHTML = parseInt((now.getTime() - time.getTime()) / 1000);

            if (game_state !== "nothing") {
                clearInterval(interval_time_id);
            }
        }
    }
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
    console.log(board_state);
    active_undo_button();

}

function active_undo_button() {
    if (board_state.length <= 1) {
        $("#undo_button").prop("disabled", true);
    } else {
        $("#undo_button").prop("disabled", false);
    }
}

/****************************************** Calling default function****************************************/

//Max width is 30
create_squares(NUMBER_SQUARES_IN_A_ROW, NUMBER_SQUARES_IN_A_COLUMN);
active_undo_button();
alert("Nếu user click bậy mà không có gì thay đổi ở board, thì không update!");