const searchBox = document.querySelector(".search-box");
const searchBtn = document.querySelector(".search-icon");
const cancelBtn = document.querySelector(".cancel-icon");
const searchInput = document.querySelector("input");
const searchData = document.querySelector(".search-data");

// 검색창 버튼
searchBtn.onclick = () => {
  searchBox.classList.add("active");
  searchBtn.classList.add("active");
  searchInput.classList.add("active");
  cancelBtn.classList.add("active");
  searchInput.focus();
  if (searchInput.value != "") {
    var values = searchInput.value;
    searchData.classList.remove("active");
    searchData.innerHTML =
      "You just typed " +
      "<span style='font-weight: 500;'>" +
      values +
      "</span>";
  } else {
    searchData.textContent = "";
  }
};
cancelBtn.onclick = () => {
  searchBox.classList.remove("active");
  searchBtn.classList.remove("active");
  searchInput.classList.remove("active");
  cancelBtn.classList.remove("active");
  searchData.classList.toggle("active");
  searchInput.value = "";
};

document.addEventListener("DOMContentLoaded", () => {
  const newDocumentBtn = document.querySelector(".new-document");
  const fileModal = document.getElementById("fileModal");
  const modal = document.getElementById("modal");
  let fileContentEditable = document.getElementById("fileContent"); // 편집 가능한 요소로 변경
  const fileModalTitle = document.getElementById("fileModalTitle");
  const fileInput = document.getElementById("fileInput"); // 파일 불러오기 클릭
  const uploadBtn = document.getElementById("uploadBtn");
  const saveFileBtn = document.getElementById("saveFileBtn");
  const fileList = document.getElementById("fileList");
  // 새 문서 만들기 버튼 클릭 시 새 노트 모달 열기
  if (newDocumentBtn) {
    newDocumentBtn.addEventListener("click", () => {
      modal.style.display = "block"; // 새 노트 모달 열기
    });
  }

  // 모달 외부 클릭 시 해당 모달 닫기
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none"; // 새 노트 모달 닫기
    } else if (event.target === fileModal) {
      fileModal.style.display = "none"; // 파일 모달 닫기
    }
  });

  // 파일 리스트 항목 클릭 시 파일 모달 열고 파일 내용 표시
  //const fileList = document.getElementById("fileList");
  if (fileList) {
    fileList.addEventListener("click", (event) => {
      if (event.target.tagName === "LI") {
        const fileName = event.target.textContent.trim().split("(")[0].trim(); // 파일 이름 추출
        fileModalTitle.textContent = fileName; // 모달 제목 설정

        // 서버에서 파일 내용을 가져오는 요청
        fetch(`http://localhost:3000/uploads/${encodeURIComponent(fileName)}`)
          .then((response) => {
            if (response.ok) {
              return response.text();
            }
            throw new Error("파일 내용을 가져오지 못했습니다.");
          })
          .then((data) => {
            fileContentEditable.textContent = data; // 파일 내용을 모달에 표시 (편집 가능한 요소)
            fileModal.style.display = "block"; // 파일 모달 열기
          })
          .catch((error) => {
            console.error("파일 내용을 불러오는 중 오류 발생:", error);
          });
      }
    });
  }

  // 파일 저장 버튼 클릭 시 편집된 파일 내용 저장
  if (saveFileBtn) {
    saveFileBtn.addEventListener("click", () => {
      const fileName = fileModalTitle.textContent;
      const editedContent = fileContentEditable.textContent; // 수정된 내용 가져오기

      // JSON 형식으로 데이터 전송
      fetch(`http://localhost:3000/uploads/${encodeURIComponent(fileName)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ editedContent: editedContent }), // JSON 형식으로 데이터 전송
      })
        .then((response) => {
          if (response.ok) {
            console.log("파일 저장 성공!");
            return response.json();
            // 성공 시 동작 수행
          } else {
            throw new Error("파일 저장 실패");
          }
        })
        .then((data) => {
          console.log(data.message);
          // 성공 시 동작 수행
        })
        .catch((error) => {
          console.error("파일 저장 중 오류 발생:", error);
        });
    });
  }

  // 파일 리스트 항목 맨 앞으로 이동하는 기능
  if (fileList) {
    fileList.addEventListener("click", (event) => {
      if (event.target.tagName === "LI") {
        const selectedFile = event.target;
        const parent = selectedFile.parentNode;
        parent.prepend(selectedFile); // 선택한 파일 항목을 맨 앞으로 이동
      }
    });
  }

  //     // 파일 업로드 처리
  //     if (uploadBtn) {
  //         uploadBtn.addEventListener('click', () => {
  //             if (fileInput && fileInput.files && fileInput.files.length > 0) {
  //                 let file = fileInput.files[0]; // 선택된 파일 가져오기
  //                 const formData = new FormData();
  //                 formData.append('file', file); // FormData에 파일 추가

  //                 // 파일 업로드 요청 보내기
  //                 fetch('http://localhost:3000/uploads', {
  //                     method: 'POST',
  //                     body: formData
  //                 })
  //                 .then(response => {
  //                     if (response.ok) {
  //                         console.log('파일 업로드 성공!');
  //                         // 업로드 성공 시 추가적인 동작 수행 (리스트에 파일 추가 등)
  //                         let li = document.createElement('li');
  //                         li.textContent = `${file.name} (${formatFileSize(file.size)})`;
  //                         fileList.appendChild(li);
  //                     } else {
  //                         throw new Error('파일 업로드 실패');
  //                     }
  //                 })
  //                 .catch(error => {
  //                     console.error('파일 업로드 중 오류 발생:', error);
  //                 });
  //             } else {
  //                 console.error('파일이 선택되지 않았습니다.');
  //             }
  //         });
  //     }
  // });

  if (uploadBtn) {
    uploadBtn.addEventListener("click", () => {
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        let file = fileInput.files[0]; // 선택된 파일 가져오기
        const formData = new FormData();
        formData.append("file", file); // FormData에 파일 추가

        // 파일 업로드 요청 보내기
        fetch("http://localhost:3000/uploads", {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error("파일 업로드 실패");
          })
          .then((data) => {
            if (data.status === "success") {
              console.log(data.message);
              // 업로드 성공 시 추가적인 동작 수행 (리스트에 파일 추가 등)
              let div = document.createElement("div");
              div.className = "file-box";
              div.innerHTML = `
                    <h2>${file.name}</h2>
                    <p>Size: ${formatFileSize(file.size)}</p>
                `;
              fileList.appendChild(div);
            } else {
              console.error(data.message);
            }
          })
          .catch((error) => {
            console.error("파일 업로드 중 오류 발생:", error);
          });
      } else {
        console.error("파일이 선택되지 않았습니다.");
      }
    });
  }
});

function formatFileSize(bytes) {
  const kb = bytes / 1024;
  if (kb < 1024) {
    return kb.toFixed(2) + " KB";
  } else {
    const mb = kb / 1024;
    return mb.toFixed(2) + " MB";
  }
}
