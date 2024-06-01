#ifdef GL_ES
precision mediump float;
#endif

#define N_VECTORS 5

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform vec2 u_divergenceVectors[N_VECTORS * N_VECTORS];

int index1D(int x, int y) {
    return y * N_VECTORS + x;

}

vec2 sampleGradient(vec2 p) {
    int index = index1D(int(p.x), int(p.y));

    return u_divergenceVectors[index];
}

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
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

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

vec2 randomGradient(vec2 p) {
    p = p + 0.1;
    vec2 sampled =  sampleGradient(p);
    //float x = sampled.x;
    //float y = sampled.y;
    // if (p.x > 8.0) return vec2(0, 0);
    float x = dot(p, vec2(123.4, 234.5));
    float y = dot(p, vec2(234.5, 345.6));
    vec2 gradient = vec2(x, y);
    gradient = sin(gradient);
    gradient = gradient * 43758.5453;
    
    gradient = sin(gradient);
    
    return gradient;
}

vec2 cubic(vec2 p) {
  return p * p * (3.0 - p * 2.0);
}

vec2 quintic(vec2 p) {
  return p * p * p * (10.0 + p * (-15.0 + p * 6.0));
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

    return perlin + 0.5;
}

#define OCTAVES 8
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * perlinNoise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.0);
    color += fbm(st*3.0);

    gl_FragColor = vec4(color,1.0);
}
