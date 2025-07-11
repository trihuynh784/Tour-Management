tinymce.init({
  selector: 'textarea.textarea-mce',  // change this value according to your HTML
  plugins: 'image code',
  images_upload_url: "/admin/upload",
  license_key: 'gpl'
});