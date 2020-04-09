//You know something's fishy when there's a file named vertex_shader.JS


//helper object to manage the construction of the frag shader
let vertex_shader = {
    _replace_string: "COORD_CALCULATION",

    _base: "",

    //mapping from human readable to executable formulas
    transformer_dict: {
        "1/Z":"one_over_z(z)",
        "1/Z^2":"one_over_z_squared(z)",
        "sqrt(2/Z)":"nth_root(divide(vec2(2,0), z), 2.)",
        "cos(Z)":"cosC(z)",
        //"sin(Z)":"sinC(coord)",
        "id":"(z)",
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
