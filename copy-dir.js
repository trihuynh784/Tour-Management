const fs = require("fs-extra");

const listFolderCopy = [
  {
    sourceDirectory: "views",
    targetDirectory: "dist/views",
  },
  {
    sourceDirectory: "public",
    targetDirectory: "dist/public",
  },
];

listFolderCopy.forEach((item) => {
  fs.copy(item.sourceDirectory, item.targetDirectory, (err) => {
    if (err) {
      console.log("Copy error!");
    } else {
      console.log("Copy success!");
    }
  });
});
