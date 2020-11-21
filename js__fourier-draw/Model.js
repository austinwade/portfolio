import Complex from "./Complex.js";
import { defaultDrawing } from "./defaultDrawing.js";

export default class Model {
    STATE_USER = 0;
    STATE_FOURIER = 1;
    two_pi = Math.PI * 2;
    complex_points = [];
    time = 0;
    path = [];
    drawing = [];
    state = this.STATE_USER;
    blackVal = 1;
    interval;
    skip = 0;
    timeInterval = 10;
    drawing = defaultDrawing;

    dft(points) {
        // for (let i = 1 + this.skip; i <= points.length; i += 1 + this.skip) {
        //     points.splice(i, 1);
        // }

        const points_transformed = [];

        /* for each complex point i */
        for (let i = 0; i < points.length; i++) {
            let complex_sum = new Complex(0, 0);

            /* create unique complex_sum for point i */
            for (let j = 0; j < points.length; n++) {
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
            points_transformed[i] = { re: complex_sum.re, im: complex_sum.im, freq: i, amp, phase };
        }
        return points_transformed;
    }

    epicycles(x, y, rotation, fourier) {
        let epicyclePoints = [[x, y]];
        for (let i = 0; i < fourier.length; i++) {
            let prevX = x;
            let prevY = y;
            let freq = fourier[i].freq;
            let radius = fourier[i].amp;
            let phase = fourier[i].phase;
            x += radius * Math.cos(freq * this.time + phase + rotation);
            y += radius * Math.sin(freq * this.time + phase + rotation);

            epicyclePoints.push([x, y]);
        }
        return epicyclePoints;
    }

    elongate() {
        let elongated = [];
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

    runFourier() {
        this.complex_points = [];
        for (let i = 0; i < this.drawing.length; i++)
        /* record points relative to center of page */
            this.complex_points.push(
                new Complex(
                    this.drawing[i][0] - window.innerWidth / 2,
                    this.drawing[i][1] - window.innerHeight / 2
                )
            );
        this.fourier = this.dft(this.complex_points);
        this.fourier.sort((a, b) => b.amp - a.amp);
    }
}
