console.log("Hey");
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange=function() {
  if (this.readyState == 4 && this.status == 200) { // To make sure the XMLHttpRequest object did recieve a valid response and is in the finished state
    var randomNumbersString = this.responseText;
    var randomNumbers = randomNumbersString.split('\n');
    var maxServiceCallLimit = 10000 * 4; //Since the API won't let me request more than 10000 random values at once. Multiplying by 4 because each pixel would need 4 values (R,G,B,Alpha Channel)
    console.log(randomNumbers);
    console.log(typeof(randomNumbersString));
    var buffer = new Uint8ClampedArray(128 * 128 * 4); // using Uint8ClampedArray just to make sure the numbers in it are in the range 0-255
    for (i = 0; i < maxServiceCallLimit; i += 4) { // Storing the first 10000 randomly generated numbers into a temporary buffer variable
        buffer[i+0] = randomNumbers[i/4];
        buffer[i+1] = randomNumbers[i/4];
        buffer[i+2] = randomNumbers[i/4];
        buffer[i+3] = 255; // Alpha Channel - 0 impies transparent and 255 implies opaque. So making sure every pixel is clearly visible
    }
    var xhttp2 = new XMLHttpRequest(); // Creating another async call to the Random service to request the remaining 6384 values
    xhttp2.onreadystatechange=function() {
      if (this.readyState == 4 && this.status == 200) {
        var randomNumbersString = this.responseText;
        var randomNumbers = randomNumbersString.split('\n');
        var c = document.getElementById("randomImage");
        var ctx = c.getContext("2d");
        var imgData = ctx.createImageData(128, 128); // Create an image object that needs to be rendered
        //console.log(randomNumbers);
        console.log(randomNumbers);
        console.log(typeof(randomNumbersString));
        console.log(imgData.data.length);
        for (i = maxServiceCallLimit, j=0; i < imgData.data.length, j<6384; i += 4,j++) { // Populating the buffer variable with the remaining values
            buffer[i+0] = randomNumbers[j];
            buffer[i+1] = randomNumbers[j];
            buffer[i+2] = randomNumbers[j];
            buffer[i+3] = 255;
        }

        imgData.data.set(buffer); // Populate the image object with all the random values we have
        console.log(buffer);
        console.log(imgData.data.length);
        ctx.putImageData(imgData, 10, 10); // Put the image object in the canvas tag
      }
    }
    xhttp2.open("GET", "https://www.random.org/integers/?num=6384&min=0&max=255&col=1&base=10&format=plain&rnd=new" , true); // Making an async call for the remaining values
    xhttp2.send();
  }
};
xhttp.open("GET", "https://www.random.org/integers/?num=10000&min=0&max=255&col=1&base=10&format=plain&rnd=new" , true); // Making an async call for the first 10,000 values
xhttp.send();
