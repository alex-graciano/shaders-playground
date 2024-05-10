# Shader playground

GLSL shader playground. Repository aimed to test simple GLSL ideas (mainly for fragment shaders). This contains the most straightforward skeleton to execute GLSL using the WebGL library [Three.js](https://threejs.org/). The web app is being bundled in a minimal [Webpack](https://webpack.js.org/) server.

It uses the simple [Tweakpane](https://tweakpane.github.io/docs/) lib to link parameters to be tested in the sketch in a straightforward way.

The repository has a set of preloaded examples that can be inspected in `./public/scenes/sceneBuilder.js`. By now, the navigation to the projects is done via url paths. It should be noted that this is a personal repository to test PoCs and sketches very quickly so this way is more than enough. Therefore, this is not intended to be a production project or code.



### Execution
```
> npm install # will install the node dependencias (just express)
> npm run start # will start the application listening to the 8080 port

# Navigate to a project accesing to localhost:8080/project
```

License
Copyright © 2024, [Alex Graciano]