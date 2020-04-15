precision mediump float; //FIXME should use regl attribute and not uniform
uniform float combine_factor;
uniform vec2 scale_factor;
uniform float rotation_factor;
uniform vec2 pan_factor;
uniform float radial_splits;

uniform vec2 u_resolution;
uniform sampler2D texture_const;

varying vec2 uv;

const float E = 2.7182818284;
const float PI = 3.1415926534;

//Normalize pan_factor (FIXME maybe do in js part, as this is only required once per frame....)
//Can be made const/in in newer webgl versions. But does not work on chrome on linux as of the 10.4.20.
vec2 pan = vec2 (pan_factor.x / u_resolution.x,
                 pan_factor.y / u_resolution.y);

float random (vec2 st) {
  return fract(sin(dot(st.xy,
      vec2(12.9898,78.233)))*43758.5453123);
}

float absolute(const vec2 v) {
  return v.x*v.x+v.y*v.y;
}

vec2 product(const vec2 a, const vec2 b) {
  return vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x);
}

vec2 conjugate(const vec2 a) {
  return vec2(a.x,-a.y);
}

vec2 divide(const vec2 a, const vec2 b) {
  return vec2(
    (a.x*b.x+a.y*b.y)/absolute(b),
    (a.y*b.x-a.x*b.y)/absolute(b));
}

vec2 to_polar(vec2 v) {
  float r = sqrt(absolute(v));
  float phi = atan(v.y, v.x);
  return vec2(r, phi);
}

vec2 from_polar(vec2 pol) {
  vec2 ret;
  ret.x = cos(pol.y);
  ret.y = sin(pol.y);
  return ret*pol.x;
}

vec2 expi(vec2 c) {
  return vec2(cos(c.x), sin(c.x))*-exp(c.y);
}

vec2 expC(vec2 c) {
  return expi(divide(c, vec2(0,1)));
}

vec2 sinC(vec2 c) {
  vec2 res;
  res = expi(c) - expi(-c);
  return divide(res, vec2(0, 2));
}

vec2 cosC(vec2 c) {
  vec2 res;
  res = expi(c) + expi(-c);
  return divide(res, vec2(2, 0));
}

vec2 rotate(vec2 v, float a) {
  return vec2(
    cos(a)*v.x - sin(a)*v.y,
    sin(a)*v.x + cos(a)*v.y
  );
}

//TODO
vec2 nth_root (vec2 v, float n) {
  vec2 pol = to_polar(v);
  v.y = pow(v.y, 1./n);
  return from_polar(v);
}

vec2 phi_mod (vec2 v, float phi) {
  vec2 pol = to_polar(v);
  pol.y = mod(pol.y, phi);
  return from_polar(pol);
}

vec2 one_over_z (vec2 v) {
  return divide(vec2(1,0), v);
} 

vec2 one_over_z_squared (vec2 v) {
  vec2 v2 = v*v;
  return divide(vec2(1,0), v2);
} 

vec2 coord_trans(vec2 z) {
    return COORD_CALCULATION;
  }

void main() {

  vec2 coord = ((uv-vec2(0.5,0.5))*scale_factor + pan);

  vec2 final_coord = coord_trans(coord);//gets replaced with actual function in transformer_shaders.js

  if(radial_splits > 1.)
    final_coord = phi_mod(final_coord, PI*2./radial_splits);
  
  final_coord = mix(coord, final_coord, combine_factor);//FIXME I don\t think this is what I want to do here...
  gl_FragColor = texture2D(texture_const,
      vec2(
        mod(final_coord.x, 1.),
        mod(final_coord.y, 1.))
    );
}