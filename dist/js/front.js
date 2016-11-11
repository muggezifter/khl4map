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
            var index = 0;
            if (currentTrack.length > 2) {
                //interval = (currentTrack[currentTrack.length - 1].timestamp - currentTrack[0].timestamp) / currentTrack.length;
                var start = new Date(currentTrack[0].date);
                var end = new Date(currentTrack[currentTrack.length - 1].date);
                //interval = (end - start);
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

                }, 
                speedfactor * interval);
            }
        }, 1000);
    }

    var displayInfo = function (node) {
        $("#display").text(
            //formatDate(node.timestamp) + 
            formatDate(node.date) +" lon:" + parseFloat(node.lon).toPrecision(8) + " lat:" + parseFloat(node.lat).toPrecision(9)
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

    var formatDate = function (date) {
        var t = new Date(date);
        var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        var year = t.getFullYear();
        var month = months[t.getMonth()];
        var date = t.getDate();
        var hour = pad(t.getHours());
        var min = pad(t.getMinutes());
        var sec = pad(t.getSeconds());
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
        return time;
    }

    var pad = function (n) {

        if  (n<10) return "0" + n;
        return n;
    }

    var playSelectChangeHandler = function (id) {
        switch (id) {
            case "pause":
                stopPlaying();
                logInConsole && console.log("pause");
                break;
            case "live":
                stopPlaying();
                logInConsole && console.log("live");
                break;
            default:
                $.getJSON("/recording/find?rec_id=" + id + "&callback=?").done(function (data) {
                    currentTrack = data;
                    play(currentTrack);
                });
                break;
        }
    };

    var stopPlaying = function () {
        $.getJSON("/play?callback=?").done(function (data) {
            logInConsole && console.log(data);
        });
        if (playIntervalId) {
            clearInterval(playIntervalId);
        }
    };

    var gridsSelectChangeHandler = function (id) {
        stopPlaying();
        $.getJSON("/grid/find?grid_id=" + id + "&callback=?").done(function (data) {
           currentGrid = data[0];
           logInConsole && console.log(currentGrid);
           populatePlaySelect(id);
           khl4map.initializeMaps(currentGrid);
        });
    }


    var populatePlaySelect = function (grid_id) {
        $.getJSON("/recording/list?grid_id=" + grid_id + "&callback=?").done(function (data) {
            addOptions("select#play_select",data,"description", "recording_id");
        });
    };

    var populateGridsSelect = function() {
        $.getJSON("/grid/list?callback=?").done(function (data) {
            addOptions("select#grid_select",data,"name", "grid_id");
        });
    };

    var addOptions = function(select,data,name,value) {
        $(select)
            .children(".dynamic")
            .remove();
        var i = data.length;
        while (data[--i]) {
            $(select)
                .append($('<option>', { class: "dynamic", value: data[i][value] })
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
})();

