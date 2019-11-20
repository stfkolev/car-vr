module.exports = '#define NIGHTLIGHT 0.4\n\nfloat normFloat(float n, float minVal, float maxVal){\n\treturn max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\n// Returns 1 if type matches val, 0 if not\nfloat checkType(float type, float val){\n\treturn step(val - 0.1, type) * step(type, val + 0.1);\n}\n\nuniform vec3 lightsT;\nuniform vec3 lightsO;\nattribute float type;\nvarying float red;\nvarying float amb;\nvarying float wht;\nvarying float brightness;\n\nvoid main(){\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );\n\n \tvec3 realPos = vec3(modelMatrix * vec4(position, 1.0));\n\tvec3 realNorm = normalize(vec3(modelMatrix * vec4(normal, 0.0)));\n\n\tvec3 lightVector = normalize(cameraPosition - realPos);\n\tbrightness = dot(realNorm, lightVector);\n\tbrightness = normFloat(brightness, 0.3, 0.2) + 0.5;\n\tbrightness *= brightness * brightness;\n\t\n\t// Type 0: FF logo\t\n\tred = checkType(type, 0.0);\n\t// FF brightens on stop light\n\tred += red * lightsO.x;\n\n\t// Type 1: center grid\n\tred += checkType(type, 1.0) * NIGHTLIGHT;\n\n\t// Type 2: Right blinker\n\tred += (checkType(type, 2.0) * NIGHTLIGHT) * step(lightsT.x, 0.0);\n\tamb = checkType(type, 2.0) * lightsT.z;\n\n\t// Type 3: Left blinker\n\tred += (checkType(type, 3.0) * NIGHTLIGHT) * step(0.0, lightsT.x);\n\tamb += checkType(type, 3.0) * lightsT.y;\n\t\n\tbrightness = clamp(brightness, 0.0, 1.0);\n}';