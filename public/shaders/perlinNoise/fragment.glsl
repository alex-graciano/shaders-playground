/**
* Resources: https://www.youtube.com/watch?v=7fd331zsie0
*
*
*/

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform bool u_debug;
uniform int u_noise;

vec2 randomGradient(vec2 p) {
    p = p + 0.1;
    float x = dot(p, vec2(123.4, 234.5));
    float y = dot(p, vec2(234.5, 345.6));
    vec2 gradient = vec2(x, y);
    gradient = sin(gradient);
    gradient = gradient * 43758.5453;
    
    gradient = sin(gradient + u_time);

    return gradient;
}


// From: https://iquilezles.org/articles/distfunctions2d/
float sdOrientedBox( in vec2 p, in vec2 a, in vec2 b, float th )
{
    float l = length(b-a);
    vec2  d = (b-a)/l;
    vec2  q = (p-(a+b)*0.5);
          q = mat2(d.x,-d.y,d.y,d.x)*q;
          q = abs(q)-vec2(l,th)*0.5;
    return length(max(q,0.0)) + min(max(q.x,q.y),0.0);    
}

float sdCircle( vec2 p, vec2 q, float r )
{
    return length(p - q) - r;
}

vec2 cubic(vec2 p) {
  return p * p * (3.0 - p * 2.0);
}

vec2 quintic(vec2 p) {
  return p * p * p * (10.0 + p * (-15.0 + p * 6.0));
}

float billowPerlinNoise(float perlin) {
    return abs(perlin);
}

float rigdedPerlinNoise(float perlin) {
    float rigded = 1.0 - abs(perlin);
    return rigded * rigded;
}

void main() {
    // We're a ssuming a square resolution for simplicity
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(st, 0.0);

    // Set up a cell grid
    st = st * 4.0;
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

    // Visualize gradients
    vec2 gridCell = gridId + gridUv;
    float distG1 = sdOrientedBox(gridCell, bl, bl + gradBl * 0.5, 0.01);
    float distG2 = sdOrientedBox(gridCell, br, br + gradBr * 0.5, 0.01);
    float distG3 = sdOrientedBox(gridCell, tl, tl + gradTl * 0.5, 0.01);
    float distG4 = sdOrientedBox(gridCell, tr, tr + gradTr * 0.5, 0.01);
    float isOnGradient = step(0.0, distG1) * step(0.0, distG2) * step(0.0, distG3) * step(0.0, distG4);

    // Visualize the center of each cell grid
    float radius = 0.02;
    vec2 gridCenter = (tr + bl) * 0.5;
    float distCenter = sdCircle(gridCenter, gridCell, radius);
    float isOnCenter = step(0.0, distCenter);

    // Distance from pixel to each grid corner in 2D
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

    // Sum 0.1 to bright the result
    color = vec3(perlin + 0.1);

    // Choose the noise flavour
    color = u_noise == 1 ? vec3(billowPerlinNoise(perlin)) : color;
    color = u_noise == 2 ? vec3(rigdedPerlinNoise(perlin)) : color;

    // Try to avoid branching
    bool pixelToDebug = (((isOnGradient * isOnCenter) == 0.0) && u_debug);
    vec3 debugColor = vec3(float(pixelToDebug), float(pixelToDebug), 0.0);
    color = max(debugColor, color);
    
	gl_FragColor = vec4(color,1.0);
}