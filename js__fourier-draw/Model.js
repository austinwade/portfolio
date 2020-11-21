"use strict";

import Complex from "./Complex.js";
import { defaultDrawing } from "./defaultDrawing.js";

export default class Model {
    time = 0;
    path = [];
    blackVal = 1;
    drawing = defaultDrawing;

    constructor(center) {
        this.center = center;
    }

    clear() {
        this.drawing = [];
        this.path = [];
    }

    dft(points) {
        const dft_points = [];

        /* for each complex point i */
        for (let i = 0; i < points.length; i++) {
            let complex_sum = new Complex(0, 0);

            /* create unique complex_sum for point i */
            for (let j = 0; j < points.length; j++) {
                const phi = (i * j * Math.PI * 2) / points.length;
                const c = new Complex(Math.cos(phi), -Math.sin(phi));
                complex_sum.add(points[j].mult(c));
            }

            /* normalize sum by point num */
            complex_sum.re = complex_sum.re / points.length;
            complex_sum.im = complex_sum.im / points.length;

            /* calcuate pythagorean amplitude */
            let amp = Math.sqrt(complex_sum.re ** 2 + complex_sum.im ** 2);

            /* calculate angle between x-axis and (x, y) -> atan2(y, x) */
            let phase = Math.atan2(complex_sum.im, complex_sum.re);

            dft_points.push({
                re: complex_sum.re,
                im: complex_sum.im,
                freq: i,
                amp: amp,
                phase: phase,
            });
        }

        return dft_points;
    }

    epicycles(x, y, rotation, fourier) {
        /* init epicycle points */
        const epicycle_points = [[x, y]];

        /* for each fourier point */
        for (let i = 0; i < fourier.length; i++) {
            let amp = fourier[i].amp;
            let freq = fourier[i].freq;
            let phase = fourier[i].phase;

            x += amp * Math.cos(this.time * freq + phase + rotation);
            y += amp * Math.sin(this.time * freq + phase + rotation);

            epicycle_points.push([x, y]);
        }

        return epicycle_points;
    }

    elongate() {
        const elongated = [];
        for (let i = 0; i < this.drawing.length - 1; i += 1) {
            elongated.push(this.drawing[i]);
            elongated.push([
                this.drawing[i][0] +
                    (this.drawing[i + 1][0] - this.drawing[i][0]) * (1 / 4),
                this.drawing[i][1] +
                    (this.drawing[i + 1][1] - this.drawing[i][1]) * (1 / 4),
            ]);
            elongated.push([
                this.drawing[i][0] +
                    (this.drawing[i + 1][0] - this.drawing[i][0]) * (2 / 4),
                this.drawing[i][1] +
                    (this.drawing[i + 1][1] - this.drawing[i][1]) * (2 / 4),
            ]);
            elongated.push([
                this.drawing[i][0] +
                    (this.drawing[i + 1][0] - this.drawing[i][0]) * (3 / 4),
                this.drawing[i][1] +
                    (this.drawing[i + 1][1] - this.drawing[i][1]) * (3 / 4),
            ]);
        }
        this.drawing = elongated;
    }

    runDFT() {
        const complex_points = [];
        for (let i = 0; i < this.drawing.length; i++)
            /* record points relative to fourier center */
            complex_points.push(
                new Complex(
                    this.drawing[i][0] - this.center[0],
                    this.drawing[i][1] - this.center[1]
                )
            );
        this.fourier = this.dft(complex_points);
        this.fourier.sort((a, b) => b.amp - a.amp);
    }
}
