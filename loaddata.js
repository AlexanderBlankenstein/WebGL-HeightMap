//to run "python3 -m http.server"

/* 
   original code taken from MDN Web Docs
   https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Lighting_in_WebGL

   -the functions which return the 3D vertices, normals, indices to
   the WebGL program
   -image array structure and variables
*/


	// flag indicating that data has been loaded and image can be drawn 
let loaded = false;

        // global variables for image data, size, and depth
	// these are set in the index.html file
let imageData = [];
let imageHeight = 0;
let imageWidth = 0;
let imageDepth = 0;

	// global geometry arrays
	// you need set these
let vertices = [];
let indices = [];
let normals = [];
let textureCoords = [];
let vertexCount = 0; 	// number of vertices, not individual values



	// create geometry which will be drawn by WebGL
	// create vertex, normal, index arrays using
	// the data from the input file is in the imageData[] array 
	// your code goes here
function initGeometry() {
	let scaling = 0.3;
	vertices = [];
	indices = [];
	normals = [];
	textureCoords = [];
	vertexCount = 0;
	
	let array2D=[];
	for(let th = 0; th < imageHeight; th++) {
		array2D.push([]);
		for(let tw = 0; tw < imageWidth; tw++) {
			array2D[th].push([]);
		}
	}
	
	// pick the larger of height or width and use that to calculate
	//    x and z step size
	let larger = 1;
	if (imageHeight == 0 || imageWidth == 0) {
		console.log("width and height cannot be Zero");
	} else {	
		if (imageHeight >= imageWidth){
			larger = imageHeight;
		} else {
			larger = imageWidth;
		}
	}
	
	// calculate step size for x and z values
	let stepSize = 1.0/larger;

	// calculate vertex array for height map
	for (let id=0; id<imageData.length; id++) {
		
		let tx = imageData[id][0]
		let tz = imageData[id][1]
		let x = imageData[id][0] * stepSize;
		let y = (imageData[id][2] / imageDepth)*scaling;
		let z = imageData[id][1] * stepSize;
		
		vertices.push(x,y,z);
		array2D[tx][tz] = y;
	}
	
	// calculate normals for height map
	

	// set the vertexCount equal to the number of vertices
	vertexCount = vertices.length/3;

	// create the indices[] array 
	// if vertices[] contains all of the values generated from the
	//    image (including duplicates) then the number of indices is the
	//    (height-1) * (width-1) of the image * the number of vertices
	//    needed to create two triangles (6)
	// the indices[] array will contain the values from 0 to the
	//    number of indices - 1
	let count = 0;
	for (let h=0; h<(imageHeight-1); h++) {
		for (let w=0; w<(imageWidth-1); w++) {
			let a = ((h*imageWidth) + w);
			let b = (((h+1)*imageWidth) + w);
			let c = b+1;
			let d = a+1;
			//indices.push(a,b,c,a,c,d);
			indices.push(a,b,c,c,d,a);
		}
	}
	
	//set up empty data array for collecting the surface normals.
	let tArray = [];
	for( var t=0; t<(imageHeight*imageWidth); t++ ) {
		tArray.push([]);
	}
	
	// calculate normals for height map
	for (let e=0; e<indices.length; e+=3) {
		// [0,20,21]  =  indices[e]
		let p1 = indices[e];
		let p2 = indices[e+1];
		let p3 = indices[e+2];
		
		let vector1 = [vertices[(p1*3)] - vertices[(p2*3)],vertices[(p1*3)+1] - vertices[(p2*3)+1],vertices[(p1*3)+2] - vertices[(p2*3)+2]];
		let vector2 = [vertices[(p3*3)] - vertices[(p2*3)],vertices[(p3*3)+1] - vertices[(p2*3)+1],vertices[(p3*3)+2] - vertices[(p2*3)+2]];
		
		let normalx = (vector1[1] * vector2[2])-(vector1[2] * vector2[1]);
		let normaly = (vector1[2] * vector2[0])-(vector1[0] * vector2[2]);
		let normalz = (vector1[0] * vector2[1])-(vector1[1] * vector2[0]);
		
		let total = normalx + normaly + normalz;
		let nx = (normalx / total);
		let ny = (normaly / total);
		let nz = (normalz / total);
		
		tArray[p1].push([nx,ny,nz]);
		tArray[p2].push([nx,ny,nz]);
		tArray[p3].push([nx,ny,nz]);
	}
	
	//average normals and set them to the normals array.
	for (let sn = 0; sn<tArray.length; sn++) {
		let totalNX = 0;
		let totalNY =0;
		let totalNZ = 0;
		for (let norm = 0; norm<tArray[sn].length; norm++) {
			totalNX += tArray[sn][norm][0];
			totalNY += tArray[sn][norm][1];
			totalNZ += tArray[sn][norm][2];
		}
		totalNX = totalNX / tArray[sn].length;
		totalNY = totalNY / tArray[sn].length;
		totalNZ = totalNZ / tArray[sn].length;
		
		normals.push(totalNX, totalNY, totalNZ);
	}
	

	// load textures coordinates, currently use same texture for colour
	//    for all points
	// you don't need to change this code but you do need to set
	//     numberIndices to the number of indices 
	numberIndices = indices.length;
	
    for (let i=0; i<(numberIndices/3); i++) {
       textureCoords.push(0.0,0.0,  1.0,0.0,   1.0,1.0,);
    }
	
	console.table(array2D);
	console.log("Vertices: "); //600
	console.log(vertices); //600
	console.log("Indices: "); //342 (1026)
	console.log(indices); //342 (1026)
	console.log("Normals: "); //600
	console.log(normals); //600
	console.log("TextureCoords: "); //2052
	console.log(textureCoords); //2052
	console.log("VertexCount: "); //600
	console.log(vertexCount); //600
}

/*
function calculateSurfaceNormal(point1, point2, point3) {
	let vu = (point2 - point1);
	let vv = (point3 - point1);
	
	let nornalx = 
}
*/


/* you don't need to change anything past this point
   the following functions return the geometry information
*/


	// return the number of indices in the object
	// this should match the number of values in the indices[] array
function getVertexCount() {
   return(vertexCount);
}

	// position array
	// vertex positions
function loadvertices() {
  return(vertices);
}


	// normals array
function loadnormals() {
   return(normals);
}


	// texture coordinates
function loadtextcoords() {
       return(textureCoords);
}


	// load vertex indices
function loadvertexindices() {
   return(indices);
}


	// texture array size and data
function loadwidth() {
   return 2;
}

function loadheight() {
   return 2;
}

	// using a fixed texture map to colour object
function loadtexture() {
   return( new Uint8Array([128,128,128,255,
                                128,128,128,255,
                                128,128,128,255,
                                128,128,128,255]) );

}

