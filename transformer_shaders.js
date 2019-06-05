//You know something's fishy when there's a file named vertex_shader.JS


//helper object to manage the construction of the frag shader
let vertex_shader = {
    _replace_string: "COORD_CALCULATION",

    _base: "",

    transformer_dict: {
        "1/Z":"one_over_z(coord)",
        "1/Z^2":"one_over_z_squared(coord)",
        "sqrt(2/Z)":"nth_root(divide(vec2(2,0), coord), 2.)",
    },

    get: function(key) {
        return this._base.replace(this._replace_string, this.transformer_dict[key])
    },

    _setup: async function() {
        let response = await fetch("transformer.frag")
        let text = await response.text()
        this._base = text;
    }
}


vertex_shader._setup()
