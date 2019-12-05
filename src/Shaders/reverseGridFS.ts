module.exports = 'uniform sampler2D texture;\nvarying float brightness;\nvarying vec2 gUV;\n\n// Normalizes a value between 0 - 1\nfloat normFloat(float n, float minVal, float maxVal){\n    return max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\nvoid main() {\n\t// Additive\n    gl_FragColor = texture2D( texture, gUV) * brightness;\n\n\t// Subtractive\n\t// gl_FragColor = texture2D( texture, gl_PointCoord ) - vec4( color, 1.0 );\n\t// gl_FragColor *= opacity;\n\n\t// Multip\n\t/* gl_FragColor = -texture2D( texture, gl_PointCoord ) * opacity;\n\tgl_FragColor *= 1.0 - vec4( color, 1.0 );\n\tgl_FragColor += 1.0; */\n}';