

const courses = document.querySelectorAll(".courseItem");

const colorThief = new ColorThief();

courses.forEach(async (course) => {
    if(course.children[0].children.length >= 2) {
        const courseName = course.children[0].children[0];
        const image = course.children[0].children[1];
        const palette = await extractColor(image);
        console.log(palette);
        courseName.style.color = `rgb(${palette[3].join(",")})`;
    }
})


function extractColor(image) {
    return new Promise((resolve) => {
        const getPalette = () => {
            return colorThief.getPalette(image, 4);
        };

        // as said in the colorthief documentation, 
        // we have to wait until the image is fully loaded.

        if (image.complete) {
            return resolve(getPalette());
        }

        image.onload = () => {
            resolve(getPalette());
        };
    });
}