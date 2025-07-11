// Upload Image Preview Field
const fileInput = document.getElementById("images");
const container = document.getElementById("preview-field");
console.log(fileInput, container);
if (fileInput && container) {
  function loadFile() {
    container.innerHTML += `<img src="${this.result}" width="180" style="object-fit: cover"/>`;
  }
  function addMultipleFiles() {
    container.innerHTML = "";

    for (const file of this.files) {
      let reader = new FileReader();
      reader.addEventListener("load", loadFile);
      reader.readAsDataURL(file);
    }
  }
  document.addEventListener("DOMContentLoaded", () => {
    fileInput.addEventListener("change", addMultipleFiles);
  });
}

// End Upload Image Preview Field
