function main() {
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");

    var left_vertex = //bagian kiri canvas adalah tampak kiri atas
        [
            //layer atas
            -0.8, -0.2, 0.2, 0.2, 0.2,   //titik kiri tengah
            -0.2, -0.2, 0.2, 0.2, 0.2,   //titik kanan tengah
            -0.230, 0.2, 0.2, 0.2, 0.2,  //titik kanan atas
            -0.230, 0.2, 0.2, 0.2, 0.2,  //titik kanan atas
            -0.770, 0.2, 0.2, 0.2, 0.2,  //titik kiri atas
            -0.8, -0.2, 0.2, 0.2, 0.2,   //titik kiri tengah

            //layer bawah
            -0.8, -0.2, 0.8, 0.8, 0.8,    //titik kiri tengah
            -0.2, -0.2, 0.8, 0.8, 0.8,    //titik kanan tengah
            -0.225, -0.25, 0.8, 0.8, 0.8, //titik kanan bawah
            -0.225, -0.25, 0.8, 0.8, 0.8, //titik kanan bawah
            -0.775, -0.25, 0.8, 0.8, 0.8, //titik kiri bawah
            -0.8, -0.2, 0.8, 0.8, 0.8,    //titik kiri tengah
        ];

    var right_vertex = //bagian kanan canvas adalah tampak depan atas
        [
            //layer atas
            0.6, -0.2, 0.2, 0.2, 0.2,   //titik kanan tengah
            0.2, -0.2, 0.2, 0.2, 0.2,   //titik kiri tengah
            0.23, 0.4, 0.2, 0.2, 0.2,   //titik kiri atas
            0.23, 0.4, 0.2, 0.2, 0.2,   //titik kiri atas
            0.57, 0.4, 0.2, 0.2, 0.2,   //titik kanan atas
            0.6, -0.2, 0.2, 0.2, 0.2,   //titik kanan tengah

            //depan bawah
            0.6, -0.2, 0.8, 0.8, 0.8,    //titik kanan tengah
            0.2, -0.2, 0.8, 0.8, 0.8,    //titik kiri tengah
            0.225, -0.25, 0.8, 0.8, 0.8, //titik kiri bawah
            0.225, -0.25, 0.8, 0.8, 0.8, //titik kiri bawah
            0.575, -0.25, 0.8, 0.8, 0.8, //titik kanan bawah
            0.6, -0.2, 0.8, 0.8, 0.8,    //titik kanan tengah
        ];

    var vertex = [...left_vertex, ...right_vertex];

    //buffer digunakan untuk menyimpan data dari satu tempat untuk dikirim ke tempar lain
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);

    //menyimpan data-data tentang vertex shader
    var vertexShaderSource =
        `
        attribute vec2 aPosition;
        attribute vec3 aColor;
        varying  vec3 vColor;
        uniform mat4 motion;
        void main()
        {
            gl_Position = motion * vec4(aPosition, 0.0, 1.0);
            vColor = aColor;
        }
    `;

    //meng-compile vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    //menyimpan data-data tentang fragment shader
    var fragmentShaderSource =
        `
        precision mediump float;
        varying vec3 vColor;
        void main()
        {
            gl_FragColor = vec4(vColor, 1.0);
        }
    `;

    //meng-compile fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    //membuat package yang berisi kombinasi vertex shader dan fragment shader
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    //menemukan lokasi aPosition
    var aPosition = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(aPosition);

    //menemukan lokasi aColor
    var aColor = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aColor);

    //menentukan kecepatan gerakan
    let speed = 0.0070;

    let change = 0;

    const motion = gl.getUniformLocation(program, "motion");

    function render() {
        if (change >= 0.6 || change <= -0.46) speed = -speed;
        change += speed;

        var left = [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0, 0, 0.0, 0.0, 1.0];

        var right = [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0, 0.0, change, 0.0, 1.0];

        //menentukan warna background
        gl.clearColor(0.0, 0.0, 1.0, 0.4); //1 0.3 0.4 0.7
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.uniformMatrix4fv(motion, false, left);
        gl.drawArrays(gl.TRIANGLES, 0, left_vertex.length / 5);

        gl.uniformMatrix4fv(motion, false, right);
        gl.drawArrays(gl.TRIANGLES, left_vertex.length / 5, right_vertex.length / 5);

        requestAnimationFrame(render);
    }

    render();

}
