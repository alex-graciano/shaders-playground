/**
* Some resources that explain how to build a fbm + domain warping system
* - https://palmdrop.site/nodes/domain-warping
* - https://st4yho.me/blog/
* - https://darienbrito.com/portfolio/pigments/
* - https://iquilezles.org/articles/warp/
* - summary and video: https://www.youtube.com/watch?v=zS-aePltWNw
*/

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_originViewport;
uniform vec2 u_mouse;
uniform float u_time;

// fbm uniforms
uniform int u_octaves;
uniform float u_gain;
uniform float u_step;
uniform float u_lacunarity;
uniform float u_spacePartitions;

// noise uniforms
uniform vec2 u_2dhash;
uniform float u_1dhash;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,u_2dhash))* u_1dhash);
}

float billowNoise(float perlin) {
    return abs(perlin);
}

float rigdedNoise(float perlin) {
    float rigded = 1.0 - abs(perlin);
    return rigded * rigded;
}

vec2 randomGradient(vec2 p) {
    p = p + 0.1;
    float x = dot(p, u_2dhash);
    float y = dot(p, u_2dhash);
    vec2 gradient = vec2(x, y);
    gradient = sin(gradient);
    gradient = gradient * u_1dhash;
    
    gradient = sin(gradient);

    return gradient;
}

vec2 cubic(vec2 p) {
  return p * p * (3.0 - p * 2.0);
}

vec2 quintic(vec2 p) {
  return p * p * p * (10.0 + p * (-15.0 + p * 6.0));
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // cubic interpolation
    vec2 u = f * f * (3.0 - 2.0 * f);

    // quintic interpolation
    // vec2 u = f * f * f * (10.0 + f * (-15.0 + f * 6.0));

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float perlinNoise(in vec2 st) {
    vec2 gridId = floor(st);
    vec2 gridUv = fract(st);

    // Get the corners of the grid
    vec2 bl = gridId + vec2(0.0, 0.0);
    vec2 br = gridId + vec2(1.0, 0.0);
    vec2 tl = gridId + vec2(0.0, 1.0);
    vec2 tr = gridId + vec2(1.0, 1.0);

    // Create a random gradient for every corner
    vec2 gradBl = randomGradient(bl);
    vec2 gradBr = randomGradient(br);
    vec2 gradTl = randomGradient(tl);
    vec2 gradTr = randomGradient(tr);

    // Distance from pixel to each grid corner in 2D
    vec2 gridCell = gridId + gridUv;
    vec2 distanceBl = gridCell - bl;
    vec2 distanceBr = gridCell - br;
    vec2 distanceTl = gridCell - tl;
    vec2 distanceTr = gridCell - tr;

    // Dot product of gradientes and distances
    float dotBl = dot(gradBl, distanceBl);
    float dotBr = dot(gradBr, distanceBr);
    float dotTl = dot(gradTl, distanceTl);
    float dotTr = dot(gradTr, distanceTr);

    // Perlin noise actual algorithm
    // https://en.wikipedia.org/wiki/Perlin_noise

    // Smooth out the result
    gridUv = quintic(gridUv);

    // Perform the interpolation
    float xBInterpolation = mix(dotBl, dotBr, gridUv.x);
    float xTInterpolation = mix(dotTl, dotTr, gridUv.x);
    float perlin = mix(xBInterpolation, xTInterpolation, gridUv.y);

    return perlin + 0.1;
}


mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}

float lines(in vec2 pos, float b){
    float scale = 2.0;
    pos *= scale;
    return smoothstep(0.0,
                    .5+b*.5,
                    abs((sin(pos.x*3.1415)+b*2.0))*.5);
}

float linesNoise(in vec2 st) {
    vec2 pos = st.yx*vec2(1.,2.);

    // Add noise
    pos = rotate2d( noise(pos) ) * pos;

    // Draw lines
    return lines(pos,.1);

}


float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = 0.5;
    vec2 frequency = vec2(1, 1);
    
    // Loop of octaves
    for (int i = 0; i < u_octaves; i++) {
        value += amplitude * perlinNoise(st * frequency);
        st *= u_step;
        amplitude *= u_gain;
        frequency *= u_lacunarity;
    }


    return value;
}

float pattern( in vec2 p ) {
    vec2 q = vec2( fbm( p + vec2(0.0,0.0) ),
                   fbm( p + vec2(5.2,1.3) ) );

    vec2 r = vec2( fbm( p + 4.0*q + vec2(1.7,9.2) ),
                   fbm( p + 4.0*q + vec2(8.3,2.8) ) );

    //vec2 s = vec2( fbm( p + 4.0*r + vec2(1.7,9.2) ),
    //                fbm( p + 4.0*r + vec2(8.3,2.8) ) );

    return fbm( p + 4.0 * r );
}


void main() {
    vec2 st = gl_FragCoord.xy/u_resolution + u_originViewport;

    
    vec3 color = vec3(0.0);
    color += pattern(st * u_spacePartitions);
    
    gl_FragColor = vec4(color,1.0);
}