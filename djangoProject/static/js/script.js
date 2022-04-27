var grid = [];
    var cur_pirate = -1;
    var pirates = [78, 78, 78, 90, 90, 90];
    var ships = [78, 90];
    var hint = [];
    var hint_name = [];
    var cur_ship = -1;
    var el_ship = null;var grid = [];
    var cur_pirate = -1;
    var pirates = [78, 78, 78, 90, 90, 90];
    var ships = [78, 90];
    var hint = [];
    var hint_name = [];
    var cur_ship = -1;
    var el_ship = null;
    var killed = 0;
    const p_c = ["player11", "player12", "player13", "player21", "player22", "player23"];
    const start_pos_top = [699, 699, 699, 699, 699, 699];
    const start_pos_left = [53, 70, 87, 1289, 1306, 1323];
    var free_pirates_1 = 0;
    var free_pirates_2 = 3;
    var photos = new Map();
    photos = {
        water: "../../static/img/empty2.png",
        blocked: "../../static/img/empty2.png",
        ship: "../../static/img/ship.png",
        closed: "../../static/img/close.png",
        empty: "../../static/img/classic-empty-1.png",
        arrow: "../../static/img/classic-arrow-1s.png",
        horse: "../../static/img/classic-horse.png",
        lab$II: "../../static/img/classic-rotate-2.png",
        lab$III: "../../static/img/classic-rotate-3.png",
        lab$IV: "../../static/img/classic-rotate-4.png",
        lab$V: "../../static/img/classic-rotate-5.png",
        ice: "../../static/img/classic-ice.png",
        croc: "../../static/img/classic-crocodile.png",
        cannibal: "../../static/img/classic-cannibal.png",
        fortress: "../../static/img/classic-fort.png",
        resurrect: "../../static/img/classic-fort-w-aborigine.png",
        trap: "../../static/img/classic-pitfall.png",
        aircraft: "../../static/img/classic-balloon.png",
        airplane: "../../static/img/classic-airplane.png",
        leftcannon: "../../static/img/left cannon.png",
        rightcannon: "../../static/img/rightcannon.png",
        chest$I: "../../static/img/classic-coins-1.png",
        chest$II: "../../static/img/classic-coins-2.png",
        chest$III: "../../static/img/classic-coins-3.png",
        chest$IV: "../../static/img/classic-coins-4.png",
        chest$V: "../../static/img/classic-coins-5.png",
        rum$barrel: "../../static/img/classic-keg.png"
    };

    function transferFailed(evt) {
      alert("При загрузке файла произошла ошибка.");
    }

    function transferCanceled(evt) {
      alert("Пользователь отменил загрузку.");
    }
    function imgon(Elem) {
        let xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("error", transferFailed, false);
        xhr.upload.addEventListener("abort", transferCanceled, false);
        xhr.onload = function() {
            var jsonResponse = JSON.parse(xhr.response);
            clear_coins();
            for (var i = 0; i < 13; i++) {
                for (var j = 0; j < 13; j++) {
                    var cell = jsonResponse[i][j];
                    if (cell['ship']) {
                        document.getElementById(cell['Id']).src = photos['ship'];
                    } else {
                        document.getElementById(cell['Id']).src = photos[cell['type']];
                    }
                    if (cell['coins'] > 0) {
                        draw_coins(cell['Id'], cell['coins']);
                    }
                    if (cell['pirates_count'] !== 0) {
                        draw_pirates(cell['Id'], cell['pirates_count'], cell['pirates_player']);
                    } else if (cell['type'] === 'lab$II') {
                        draw_II_passage(cell);
                    } else if (cell['type'] === 'lab$III') {
                        draw_III_passage(cell);
                    } else if (cell['type'] === 'lab$IV') {
                        draw_IV_passage(cell);
                    } else if (cell['type'] === 'lab$V') {
                        draw_V_passage(cell);
                    }
                }
            }
            if (free_pirates_1 < 3) {
                var tmp1 = 0;
                for (var i = free_pirates_1; i < 3; i++) {
                    document.getElementById(p_c[i]).style.top = 54 + 'px';
                    document.getElementById(p_c[i]).style.left = 13 + tmp1 * 17 + 'px';
                    tmp1 += 1;
                }
            }
            if (free_pirates_2 < 6) {
                var tmp2 = 0;
                for (var i = free_pirates_2; i < 6; i++) {
                    document.getElementById(p_c[i]).style.top = 71 + 'px';
                    document.getElementById(p_c[i]).style.left = 13 + tmp2 * 17 + 'px';
                    tmp2 += 1;
                }
            }
            free_pirates_1 = 0;
            free_pirates_2 = 3;
            cur_res(jsonResponse[0][0]['coins_1_player'], jsonResponse[0][0]['coins_2_player']);
            if (jsonResponse[0][0]['player_turn'] === 1) {
                document.getElementById('turn').src = "../../static/img/first_player.png";
            } else {
                document.getElementById('turn').src = "../../static/img/second_player.png";
            }
        }
        xhr.open('POST', "http://2e90-164-138-95-213.ngrok.io/RizoProject_war/jackal/game");
        xhr.send(parseInt(Elem.id));
    }

    function cur_res(count1, count2) {
        var res1 = document.createElement("DIV");
        res1.innerText = count1;
        res1.id = 900 + document.querySelector('.money').childElementCount;
        res1.style.position = 'absolute';
        res1.style.top = 10 + 'px';
        res1.style.left = 170 + 'px';
        var money = document.querySelector('.money');
        money.appendChild(res1);
        var res2 = document.createElement("DIV");
        res2.innerText = count2;
        res2.id = 900 + document.querySelector('.money').childElementCount;
        res2.style.position = 'absolute';
        res2.style.top = 34 + 'px';
        res2.style.left = 170 + 'px';
        money.appendChild(res2);
    }

    function draw_coins(id, count) {
        let tmp_top = parseInt(id / 13);
        let tmp_left = id % 13;
        var coin = document.createElement("IMG");
        coin.src = "../../static/img/money.png";
        coin.width = "20";
        coin.height = "20";
        coin.style.position = 'absolute';
        coin.style.top = 137 + tmp_top * 107 + 'px';
        coin.style.left = 133 + tmp_left * 103 + 'px';
        coin.id = 1000 + document.querySelector('.money').childElementCount;
        var money = document.querySelector('.money');
        money.appendChild(coin);
        var text = document.createElement("DIV");
        text.innerText = count;
        text.id = 900 + document.querySelector('.money').childElementCount;
        text.width = "20";
        text.height = "20";
        text.style.position = 'absolute';
        text.style.top = 137 + tmp_top * 107 + 'px';
        text.style.left = 133 + tmp_left * 103 + 'px';
        money.appendChild(text);
    }

    function clear_coins() {
        for (var i = 0; i < 100; i++) {
            if (document.getElementById(1000 + i)) {
                document.getElementById(1000 + i).remove();
            }
            if (document.getElementById(900 + i)) {
                document.getElementById(900 + i).remove();
            }
        }
    }

    function draw_coin_on_passage(id, start_top, start_left, count) {
        let tmp_top = parseInt(id / 13);
        let tmp_left = id % 13;
        var coin = document.createElement("IMG");
        coin.src = "../../static/img/money.png";
        coin.width = "15";
        coin.height = "15";
        coin.style.position = 'absolute';
        coin.style.top = start_top + tmp_top * 107 + 'px';
        coin.style.left = start_left + tmp_left * 103 + 'px';
        coin.id = 1000 + document.querySelector('.money').childElementCount;
        var money = document.querySelector('.money');
        money.appendChild(coin);
        var text = document.createElement("DIV");
        text.innerText = count;
        text.id = 900 + document.querySelector('.money').childElementCount;
        text.width = "15";
        text.height = "15";
        text.style.position = 'absolute';
        text.style.top = start_top + tmp_top * 107 + 'px';
        text.style.left = start_left + tmp_left * 103 + 'px';
        money.appendChild(text);
    }

    function few_pirates(start_top, start_left, id, count) {
        let tmp_top = parseInt(id / 13);
        let tmp_left = id % 13;
        var money = document.querySelector('.money');
        var text = document.createElement("DIV");
        text.innerText = count;
        text.id = 900 + document.querySelector('.money').childElementCount;
        text.width = "15";
        text.height = "15";
        text.style.position = 'absolute';
        text.style.color = 'white';
        text.style.top = start_top + tmp_top * 107 + 'px';
        text.style.left = start_left + tmp_left * 103 + 'px';
        money.appendChild(text);
    }

    function draw_pirates(id, count, player) {
        let tmp_top = parseInt(id / 13);
        let tmp_left = id % 13;
        if (player === 0) {
            document.getElementById(p_c[free_pirates_1]).style.top = (57 + tmp_top * 107) + 'px';
            document.getElementById(p_c[free_pirates_1]).style.left = (53 + tmp_left * 103) + 'px';
            free_pirates_1 += 1;
        } else {
            document.getElementById(p_c[free_pirates_2]).style.top = (57 + tmp_top * 107) + 'px';
            document.getElementById(p_c[free_pirates_2]).style.left = (53 + tmp_left * 103) + 'px';
            free_pirates_2 += 1;
        }
        if (count > 1) {
            if (player === 0) {
                document.getElementById(p_c[free_pirates_1]).style.top = (57 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_1]).style.left = (70 + tmp_left * 103) + 'px';
                free_pirates_1 += 1;
            } else {
                document.getElementById(p_c[free_pirates_2]).style.top = (57 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_2]).style.left = (70 + tmp_left * 103) + 'px';
                free_pirates_2 += 1;
            }
        }
        if (count > 2) {
            if (player === 0) {
                document.getElementById(p_c[free_pirates_1]).style.top = (57 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_1]).style.left = (87 + tmp_left * 103) + 'px';
                free_pirates_1 += 1;
            } else {
                document.getElementById(p_c[free_pirates_2]).style.top = (57 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_2]).style.left = (87 + tmp_left * 103) + 'px';
                free_pirates_2 += 1;
            }
        }
    }

    function draw_II_passage(cell) {
        let id = cell['Id'];
        let tmp_top = parseInt(id / 13);
        let tmp_left = id % 13;
        if (cell['coins_I_passage'] !== 0) {
            draw_coin_on_passage(cell['Id'], 108, 60, cell['coins_I_passage']);
        }
        if (cell['coins_II_passage'] !== 0) {
            draw_coin_on_passage(cell['Id'], 86, 121, cell['coins_II_passage']);
        }
        if (cell['pirates_I_passage'] !== 0) {
            if (cell['player_I_passage'] === 0) {
                document.getElementById(p_c[free_pirates_1]).style.top = (134 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_1]).style.left = (64 + tmp_left * 103) + 'px';
                free_pirates_1 += 1;
            } else {
                document.getElementById(p_c[free_pirates_2]).style.top = (134 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_2]).style.left = (64 + tmp_left * 103) + 'px';
                free_pirates_2 += 1;
            }
            few_pirates(134, 64, id, cell['pirates_I_passage']);
        }
        if (cell['pirates_II_passage'] !== 0) {
            if (cell['player_II_passage'] === 0) {
                document.getElementById(p_c[free_pirates_1]).style.top = (57 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_1]).style.left = (119 + tmp_left * 103) + 'px';
                free_pirates_1 += 1;
            } else {
                document.getElementById(p_c[free_pirates_2]).style.top = (57 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_2]).style.left = (119 + tmp_left * 103) + 'px';
                free_pirates_2 += 1;
            }
            few_pirates(57, 119, id, cell['pirates_II_passage']);
        }
    }

    function draw_III_passage(cell) {
        let id = cell['Id'];
        let tmp_top = parseInt(id / 13);
        let tmp_left = id % 13;
        if (cell['coins_I_passage'] !== 0) {
            draw_coin_on_passage(cell['Id'], 131, 88, cell['coins_I_passage']);
        }
        if (cell['coins_II_passage'] !== 0) {
            draw_coin_on_passage(cell['Id'], 97, 109, cell['coins_II_passage']);
        }
        if (cell['coins_III_passage'] !== 0) {
            draw_coin_on_passage(cell['Id'], 57, 96, cell['coins_III_passage']);
        }
        if (cell['pirates_I_passage'] !== 0) {
            if (cell['player_I_passage'] === 0) {
                document.getElementById(p_c[free_pirates_1]).style.top = (129 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_1]).style.left = (128 + tmp_left * 103) + 'px';
                free_pirates_1 += 1;
            } else {
                document.getElementById(p_c[free_pirates_2]).style.top = (129 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_2]).style.left = (128 + tmp_left * 103) + 'px';
                free_pirates_2 += 1;
            }
            few_pirates(129, 128, id, cell['pirates_I_passage']);
        }
        if (cell['pirates_II_passage'] !== 0) {
            if (cell['player_II_passage'] === 0) {
                document.getElementById(p_c[free_pirates_1]).style.top = (91 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_1]).style.left = (79 + tmp_left * 103) + 'px';
                free_pirates_1 += 1;
            } else {
                document.getElementById(p_c[free_pirates_2]).style.top = (91 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_2]).style.left = (79 + tmp_left * 103) + 'px';
                free_pirates_2 += 1;
            }
            few_pirates(91, 79, id, cell['pirates_II_passage']);
        }
        if (cell['pirates_III_passage'] !== 0) {
            if (cell['player_III_passage'] === 0) {
                document.getElementById(p_c[free_pirates_1]).style.top = (57 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_1]).style.left = (129 + tmp_left * 103) + 'px';
                free_pirates_1 += 1;
            } else {
                document.getElementById(p_c[free_pirates_2]).style.top = (57 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_2]).style.left = (129 + tmp_left * 103) + 'px';
                free_pirates_2 += 1;
            }
            few_pirates(57, 129, id, cell['pirates_III_passage']);
        }
    }

    function draw_IV_passage(cell) {
        let id = cell['Id'];
        let tmp_top = parseInt(id / 13);
        let tmp_left = id % 13;
        if (cell['coins_I_passage'] !== 0) {
            draw_coin_on_passage(id, 136, 94, cell['coins_I_passage']);
        }
        if (cell['coins_II_passage'] !== 0) {
            draw_coin_on_passage(id, 108, 97, cell['coins_II_passage']);
        }
        if (cell['coins_III_passage'] !== 0) {
            draw_coin_on_passage(id, 81, 88, cell['coins_III_passage']);
        }
        if (cell['coins_IV_passage'] !== 0) {
            draw_coin_on_passage(id, 57, 105, cell['coins_IV_passage']);
        }
        if (cell['pirates_I_passage'] !== 0) {
            if (cell['player_I_passage'] === 0) {
                document.getElementById(p_c[free_pirates_1]).style.top = (137 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_1]).style.left = (124 + tmp_left * 103) + 'px';
                free_pirates_1 += 1;
            } else {
                document.getElementById(p_c[free_pirates_2]).style.top = (137 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_2]).style.left = (124 + tmp_left * 103) + 'px';
                free_pirates_2 += 1;
            }
            few_pirates(137, 124, id, cell['pirates_I_passage']);
        }
        if (cell['pirates_II_passage'] !== 0) {
            if (cell['player_II_passage'] === 0) {
                document.getElementById(p_c[free_pirates_1]).style.top = (110 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_1]).style.left = (68 + tmp_left * 103) + 'px';
                free_pirates_1 += 1;
            } else {
                document.getElementById(p_c[free_pirates_2]).style.top = (110 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_2]).style.left = (68 + tmp_left * 103) + 'px';
                free_pirates_2 += 1;
            }
            few_pirates(110, 68, id, cell['pirates_II_passage']);
        }
        if (cell['pirates_III_passage'] !== 0) {
            if (cell['player_III_passage'] === 0) {
                document.getElementById(p_c[free_pirates_1]).style.top = (76 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_1]).style.left = (116 + tmp_left * 103) + 'px';
                free_pirates_1 += 1;
            } else {
                document.getElementById(p_c[free_pirates_2]).style.top = (76 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_2]).style.left = (116 + tmp_left * 103) + 'px';
                free_pirates_2 += 1;
            }
            few_pirates(76, 116, id, cell['pirates_III_passage']);
        }
        if (cell['pirates_IV_passage'] !== 0) {
            if (cell['player_IV_passage'] === 0) {
                document.getElementById(p_c[free_pirates_1]).style.top = (57 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_1]).style.left = (70 + tmp_left * 103) + 'px';
                free_pirates_1 += 1;
            } else {
                document.getElementById(p_c[free_pirates_2]).style.top = (57 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_2]).style.left = (70 + tmp_left * 103) + 'px';
                free_pirates_2 += 1;
            }
            few_pirates(57, 70, id, cell['pirates_IV_passage']);
        }
    }

    function draw_V_passage(cell) {
        let id = cell['Id'];
        let tmp_top = parseInt(id / 13);
        let tmp_left = id % 13;
        if (cell['coins_I_passage'] !== 0) {
            draw_coin_on_passage(cell['Id'], 92, 132, cell['coins_I_passage']);
        }
        if (cell['coins_II_passage'] !== 0) {
            draw_coin_on_passage(cell['Id'], 84, 104, cell['coins_II_passage']);
        }
        if (cell['coins_III_passage'] !== 0) {
            draw_coin_on_passage(cell['Id'], 105, 91, cell['coins_III_passage']);
        }
        if (cell['coins_IV_passage'] !== 0) {
            draw_coin_on_passage(cell['Id'], 126, 103, cell['coins_IV_passage']);
        }
        if (cell['coins_V_passage'] !== 0) {
            draw_coin_on_passage(cell['Id'], 113, 134, cell['coins_V_passage']);
        }
        if (cell['pirates_I_passage'] !== 0) {
            if (cell['player_I_passage'] === 0) {
                document.getElementById(p_c[free_pirates_1]).style.top = (67 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_1]).style.left = (138 + tmp_left * 103) + 'px';
                free_pirates_1 += 1;
            } else {
                document.getElementById(p_c[free_pirates_2]).style.top = (67 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_2]).style.left = (138 + tmp_left * 103) + 'px';
                free_pirates_2 += 1;
            }
            few_pirates(67, 138, id, cell['pirates_I_passage']);
        }
        if (cell['pirates_II_passage'] !== 0) {
            if (cell['player_II_passage'] === 0) {
                document.getElementById(p_c[free_pirates_1]).style.top = (62 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_1]).style.left = (93 + tmp_left * 103) + 'px';
                free_pirates_1 += 1;
            } else {
                document.getElementById(p_c[free_pirates_2]).style.top = (62 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_2]).style.left = (93 + tmp_left * 103) + 'px';
                free_pirates_2 += 1;
            }
            few_pirates(62, 93, id, cell['pirates_II_passage']);
        }
        if (cell['pirates_III_passage'] !== 0) {
            if (cell['player_III_passage'] === 0) {
                document.getElementById(p_c[free_pirates_1]).style.top = (90 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_1]).style.left = (63 + tmp_left * 103) + 'px';
                free_pirates_1 += 1;
            } else {
                document.getElementById(p_c[free_pirates_2]).style.top = (90 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_2]).style.left = (63 + tmp_left * 103) + 'px';
                free_pirates_2 += 1;
            }
            few_pirates(90, 63, id, cell['pirates_III_passage']);
        }
        if (cell['pirates_IV_passage'] !== 0) {
            if (cell['player_IV_passage'] === 0) {
                document.getElementById(p_c[free_pirates_1]).style.top = (126 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_1]).style.left = (74 + tmp_left * 103) + 'px';
                free_pirates_1 += 1;
            } else {
                document.getElementById(p_c[free_pirates_2]).style.top = (126 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_2]).style.left = (74 + tmp_left * 103) + 'px';
                free_pirates_2 += 1;
            }
            few_pirates(126, 74, id, cell['pirates_IV_passage']);
        }
        if (cell['pirates_V_passage'] !== 0) {
            if (cell['player_V_passage'] === 0) {
                document.getElementById(p_c[free_pirates_1]).style.top = (133 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_1]).style.left = (128 + tmp_left * 103) + 'px';
                free_pirates_1 += 1;
            } else {
                document.getElementById(p_c[free_pirates_2]).style.top = (133 + tmp_top * 107) + 'px';
                document.getElementById(p_c[free_pirates_2]).style.left = (128 + tmp_left * 103) + 'px';
                free_pirates_2 += 1;
            }
            few_pirates(133, 128, id, cell['pirates_V_passage']);
        }
    }