/*jslint devel: true, browser: true, white: true, nomen: true */
/*global alice: false */

/* Copyright 2011-2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* ===========================================================================
 * builder.js
 * ===========================================================================
 */

var a = alice.init();

a.slide({
    elems: "elem1",
    move: "left",
    duration: {
        "value": "1000ms",
        "randomness": "0%",
        "offset": "150ms"
    }
});

// if (typeof jWorkflow !== "undefined") {
//     a.start();
// }

//----------------------------------------------------------------------------

var app = {};

/**
 *
 */
app.serialize = function (obj) {
    "use strict";

    var val, vArr, vObj, i, attr;

    if (obj !== undefined) {
        switch (obj.constructor) {
        case "Array":
            vArr = "[";
            for (i = 0; i < obj.length; i += 1) {
                if (i > 0) {
                    vArr += ",";
                }
                vArr += this.serialize(obj[i]);
            }
            vArr += "]";
            return vArr;
        case "String":
            val = '"' + obj + '"';
            return val;
        case "Number":
            val = isFinite(obj) ? obj.toString() : null;
            return val;
        case "Date":
            val = "#" + obj + "#";
            return val;
        default:
            if (typeof obj === "object") {
                vObj = [];

                for (attr in obj) {
                    //console.log(attr, typeof obj[attr], obj[attr]);
                    if (obj.hasOwnProperty(attr)) {
                        if (attr === "elems") {
                            vObj.push('"' + attr + '": ["' + obj[attr].id + '"]');
                        }
                        else if (typeof obj[attr] !== "function") {
                            if (typeof obj[attr] === "object" || typeof obj[attr] === "number") {
                                vObj.push('"' + attr + '": ' + this.serialize(obj[attr]));
                            }
                            else {
                                vObj.push('"' + attr + '": "' + this.serialize(obj[attr]) + '"');
                            }
                        }
                    }
                }

                if (vObj.length > 0) {
                    return "{" + vObj.join(",") + "}";
                }
                else {
                    return "{}";
                }
            }
            else {
                return obj.toString();
            }
        }
    }

    return null;
};

/**
 *
 */
app.applyStyle = function () {
    "use strict";

    var i, j, elem, container, perspective, transform,
        transformFunctions = ["rotate", "rotateX", "rotateY", "scale", "scaleX", "scaleY", "skew", "skewX", "skewY", "translate", "translateX", "translateY"];

    for (i = 1; i <= 1; i += 1) {
        elem = document.getElementById("elem" + i);
        container = document.getElementById("container" + i);

        perspective = document.getElementById("transform_perspective" + i).value;

        transform = "";

        for (j = 0; j < transformFunctions.length; j += 1) {
            if (document.getElementById("transform_" + transformFunctions[j] + i)) {
                if (document.getElementById("transform_" + transformFunctions[j] + i).value !== "") {
                    transform += " " + transformFunctions[j] + "(" + document.getElementById("transform_" + transformFunctions[j] + i).value + ")";
                }
            }
            else {
                console.warn("Skipping " + "transform_" + transformFunctions[j] + i);
            }
        }

        if (a.debug) {
            console.log(elem.id + ": perspective=" + perspective + ", transform=" + transform);
        }

        if ("MozTransform" in elem.style) {
            container.style.MozPerspective = perspective;
            elem.style.MozTransform = transform;
        }
        else if (alice.prefix + "transform" in elem.style) {
            container.style[alice.prefix + "perspective"] = perspective;
            elem.style[alice.prefix + "transform"] = transform;
        }
        else {
            console.warn("Transform not supported in this browser.");
        }
    }
};

/**
 *
 */
app.applyEffect = function (param) {
    "use strict";

    console.info("applyEffect " + param.value, param);

    if (document.getElementById("json")) {
        document.getElementById("json").innerHTML = "";
    }

    var i, ret;

//  for (i = 1; i <= 1; i += 1) {
        var p = {
            elems: param,

            delay: {
                value: document.getElementById("delay1").value,
                randomness: document.getElementById("randomness1").value
            },
            duration: {
                value: document.getElementById("duration1").value,
                randomness: document.getElementById("randomness1").value
            },
            timing: document.getElementById("timing1").value,
            iteration: document.getElementById("iteration1").value,
            direction: document.getElementById("direction1").value,
            playstate: document.getElementById("playstate1").value,

            move: document.getElementById("move1").value,
            rotate: document.getElementById("rotate1").value,
            flip: document.getElementById("flip1").value,
            turns: document.getElementById("turns1").value,
            fade: document.getElementById("fade1").value,
            scale: {
                from: document.getElementById("scaleFrom1").value,
                to: document.getElementById("scaleTo1").value
            },
            shadow: document.getElementById("shadow1").checked,
            overshoot: document.getElementById("overshoot1").value,
            perspective: document.getElementById("perspective1").value,
            perspectiveOrigin: document.getElementById("perspective_origin1").value,
            backfaceVisibility: document.getElementById("backface_visibility1").value
        };

        switch (param.value) {
        case "旋轉飛入":
            p.fade = "in";
            p.rotate = 720;
            ret = a.drain({elems: p.elems, fade: p.fade, rotate: p.rotate, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "旋轉飛出":
            p.fade = "out";
            p.rotate = -720;
            ret = a.drain({elems: p.elems, fade: p.fade, rotate: p.rotate, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "淡入":
            p.fade = "in";
            ret = a.fade({elems: p.elems, fade: p.fade, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "淡出":
            p.fade = "out";
            ret = a.fade({elems: p.elems, fade: p.fade, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "翻頁(向左)":
            p.flip = "left";
            ret = a.pageFlip({elems: p.elems, flip: p.flip, turns: p.turns, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "翻頁(向右)":
            p.flip = "right";
            ret = a.pageFlip({elems: p.elems, flip: p.flip, turns: p.turns, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "翻頁(向上)":
            p.flip = "up";
            ret = a.pageFlip({elems: p.elems, flip: p.flip, turns: p.turns, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "翻頁(向下)":
            p.flip = "down";
            ret = a.pageFlip({elems: p.elems, flip: p.flip, turns: p.turns, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "翻轉飛入":
            p.fade = "in";
            p.rotate = 720;
            p.flip = "right";
            ret = a.phantomZone({elems: p.elems, fade: p.fade, rotate: p.rotate, flip: p.flip, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "翻轉飛出":
            p.fade = "out";
            p.rotate = -720;
            p.flip = "left";
            ret = a.phantomZone({elems: p.elems, fade: p.fade, rotate: p.rotate, flip: p.flip, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "旗幟揮舞":
            p.rotate = -720;
            p.perspectiveOrigin = "top-right";
            ret = a.raceFlag({elems: p.elems, rotate: p.rotate, perspectiveOrigin: p.perspectiveOrigin, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "向左滑入":
            p.move = "left";
            ret = a.slide({elems: p.elems, move: p.move, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "向右滑入":
            p.move = "right";
            ret = a.slide({elems: p.elems, move: p.move, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "向上滑入":
            p.move = "up";
            ret = a.slide({elems: p.elems, move: p.move, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "向下滑入":
            p.move = "down";
            ret = a.slide({elems: p.elems, move: p.move, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "向左旋轉":
            p.flip = "left";
            ret = a.spin({elems: p.elems, flip: p.flip, turns: p.turns, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, playstate: p.playstate});
            break;
        case "向右旋轉":
            p.flip = "right";
            ret = a.spin({elems: p.elems, flip: p.flip, turns: p.turns, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, playstate: p.playstate});
            break;
        case "向上旋轉":
            p.flip = "up";
            ret = a.spin({elems: p.elems, flip: p.flip, turns: p.turns, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, playstate: p.playstate});
            break;
        case "向下旋轉":
            p.flip = "down";
            ret = a.spin({elems: p.elems, flip: p.flip, turns: p.turns, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, playstate: p.playstate});
            break;

        case "向左滾動":
            p.move = "left";
            ret = a.toss({elems: p.elems, move: p.move, overshoot: p.overshoot, perspectiveOrigin: p.perspectiveOrigin, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "向右滾動":
            p.move = "right";
            ret = a.toss({elems: p.elems, move: p.move, overshoot: p.overshoot, perspectiveOrigin: p.perspectiveOrigin, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "向上滾動":
            p.move = "up";
            ret = a.toss({elems: p.elems, move: p.move, overshoot: p.overshoot, perspectiveOrigin: p.perspectiveOrigin, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "向下滾動":
            p.move = "down";
            ret = a.toss({elems: p.elems, move: p.move, overshoot: p.overshoot, perspectiveOrigin: p.perspectiveOrigin, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "對角翻轉(向左)":
            p.flip = "left";
            ret = a.twirl({elems: p.elems, flip: p.flip, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "對角翻轉(向右)":
            p.flip = "right";
            ret = a.twirl({elems: p.elems, flip: p.flip, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "放大 (125%)":
            p.scale = {from: "100%", to: "125%"};
            p.shadow = true;
            p.move = "left";
            ret = a.zoom({elems: p.elems, scale: p.scale, shadow: p.shadow, move: p.move, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;
        case "縮小 (75%)":
            p.scale = {from: "100%", to: "75%"};
            p.shadow = false;
            p.move = "left";
            ret = a.zoom({elems: p.elems, scale: p.scale, shadow: p.shadow, move: p.move, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "彈跳":
            p.scale = {from: "100%", to: "125%"};
            p.shadow = true;
            p.duration = "500ms";
            p.timing = "easeOutSine";
            p.iteration = "infinite";
            p.direction = "alternate";
            ret = a.bounce({elems: p.elems, scale: p.scale, shadow: p.shadow, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "跳舞":
            p.duration = "500ms";
            p.timing = "easeInOutBack";
            p.iteration = "infinite";
            p.direction = "alternate";
            p.rotate = 45;
            ret = a.dance({elems: p.elems, rotate: p.rotate, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "懸掛搖擺":
            p.duration = "1000ms";
            p.timing = "linear";
            p.iteration = "infinite";
            p.direction = "alternate";
            p.rotate = 45;
            p.overshoot = 0;
            ret = a.hinge({elems: p.elems, rotate: p.rotate, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "左右搖擺":
            p.duration = "1000ms";
            p.timing = "ease-in-out";
            p.iteration = "infinite";
            p.direction = "alternate";
            p.rotate = 45;
            p.overshoot = 0;
            ret = a.pendulum({elems: p.elems, rotate: p.rotate, overshoot: p.overshoot, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        case "搖晃":
            p.duration = "200ms";
            p.timing = "linear";
            p.iteration = "infinite";
            p.direction = "alternate";
            p.rotate = 5;
            p.perspectiveOrigin = "center";
            ret = a.wobble({elems: p.elems, rotate: p.rotate, perspectiveOrigin: p.perspectiveOrigin, duration: p.duration, timing: p.timing, delay: p.delay, iteration: p.iteration, direction: p.direction, playstate: p.playstate});
            break;

        default:
            ret = a.cheshire(p);
            break;
        }

        // if (typeof jWorkflow !== "undefined") {
        //     a.start();
        // }

        if (document.getElementById("json")) {
            //document.getElementById("json").innerHTML += JSON.stringify(ret) + "\n\n";
            document.getElementById("json").innerHTML += '<script type="text/javascript">alicejs.cheshire(' + this.serialize(ret) + ");" + "</script>\n\n";
        }
//    }
};

/**
 *
 */
app.handleChange = function (elem, ids) {
    var state;
    for (var i = 0; i < ids.length; i++) {
        state = (elem.value === "custom") ? "block" : "none";
        document.getElementById(ids[i]).style.display = state;
    }
};
