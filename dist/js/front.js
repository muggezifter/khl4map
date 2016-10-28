"use strict";

(function () {
    var currentTrack = null;
    var currentGrid = null;
    var logInConsole = true;
    var interval = 10;
    var playIntervalId;
    var speedfactor = 1000;
    var vol= 0.6;
    var khl4map = createMap();

    var play = function (currentTrack) {
        $.getJSON("/play?callback=?").done(function (data) {
            logInConsole && console.log(data);
        });

        khl4map.initializeMaps(currentGrid);
        setTimeout(function () {
            if (playIntervalId) {
                clearInterval(playIntervalId);
            }
            // console.log(currentTrack);
            var index = 0;
            if (currentTrack.length > 2) {
                interval = (currentTrack[currentTrack.length - 1].timestamp - currentTrack[0].timestamp) / currentTrack.length;
                playNode(currentTrack[0])
                playIntervalId = setInterval(function () {
                    if (currentTrack[++index]) {
                        playNode(currentTrack[index]);
                        // console.log(index);
                    } else {
                        clearInterval(playIntervalId);
                        // console.log("end");;
                        $.getJSON("/play?callback=?").done(function (data) {
                            logInConsole && console.log(data);
                        });
                    }

                }, speedfactor * interval);
            }
        }, 1000);
    }

    var displayInfo = function (node) {
        $("#display").text(
            formatDate(node.timestamp) + " lon:" + parseFloat(node.lon).toPrecision(8) + " lat:" + parseFloat(node.lat).toPrecision(9)
        );
    }

    var playNode = function (node) {
        displayInfo(node);
        khl4map.addMark(node.lat, node.lon);
        var q = "";
        for (var n in node.chord) {
            q += "n=" + node.chord[n].note + "&v=" + vol*(node.chord[n].velocity) + "&";
            $.getJSON("/play?" + q + "&callback=?").done(function (data) {
                logInConsole && console.log(data);
            });
        }
    }

    var formatDate = function (timestamp) {
        var a = new Date(timestamp * 1000);
        var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = (a.getHours() + "0").substr(0, 2);
        var min = (a.getMinutes() + "0").substr(0, 2);
        var sec = (a.getSeconds() + "0").substr(0, 2);
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
        return time;
    }

    var playSelectChangeHandler = function (id) {
        switch (id) {
            case "pause":
                $.getJSON("/play?callback=?").done(function (data) {
                    logInConsole && console.log(data);
                });
                if (playIntervalId) {
                    clearInterval(playIntervalId);
                }
                logInConsole && console.log("pause");
                break;
            case "live":
                $.getJSON("/play?callback=?").done(function (data) {
                    logInConsole &&console.log(data);
                });
                if (playIntervalId) {
                    clearInterval(playIntervalId);
                }
                logInConsole && console.log("live");
                break;
            default:
                $.getJSON("/recording/find?rec_id=" + id + "&callback=?").done(function (data) {
                    currentTrack = data[0].nodes;
                    play(currentTrack);
                });
                break;
        }

    };

    var gridsSelectChangeHandler = function (id) {
        $.getJSON("/grid/find?grid_id=" + id + "&callback=?").done(function (data) {
           currentGrid = data[0];
           logInConsole && console.log(currentGrid);
           khl4map.initializeMaps(currentGrid);
        });
    }


    var populatePlaySelect = function () {
        $.getJSON("/recording/list?callback=?").done(function (data) {
            addOptions("select#play_select",data,"description", "recording_id");
        });
    };

    var populateGridsSelect = function() {
        $.getJSON("/grid/list?callback=?").done(function (data) {
            addOptions("select#grid_select",data,"name", "grid_id");
        });
    };

    var addOptions = function(select,data,name,value) {
        var i = data.length;
        while (data[--i]) {
            $(select)
                .append($('<option>', { value: data[i][value] })
                    .text((data[i][name])
                        ? (data[i][name])
                        : data[i][value]));

        }
    };

    $("#acc input:checkbox").change(
        function (event) {
            speedfactor = (speedfactor==200)?1000:200;
        });

    $("select#play_select").change(
        function (event) {
            playSelectChangeHandler(event.target.value)
        });

    $("select#grid_select").change(
        function (event) {
            gridsSelectChangeHandler(event.target.value)
        });


    populateGridsSelect();
    populatePlaySelect();

})();

