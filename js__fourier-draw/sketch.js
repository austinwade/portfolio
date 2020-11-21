"use strict";

import View from "./View.js";
import Model from "./Model.js";

(function Controller() {
    let model = new Model();
    let view = new View(model);

    view.runDrawing();
})();
