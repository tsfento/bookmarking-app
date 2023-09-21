const body = document.body;
const input = document.querySelector('input[type=text]');
const overlay = document.querySelector('.overlay');

function showFloater() {
    body.classList.add('show-floater');
}

function closeFloater() {
    if (body.classList.contains('show-floater')) {
        body.classList.remove('show-floater');
    }
}

input.addEventListener('focusin', showFloater);
// input.addEventListener('focusout', closeFloater);
overlay.addEventListener('click', closeFloater);

// **********************

const bookmarksList = document.querySelector('.bookmarks-list');
const bookmarkForm = document.querySelector('.bookmark-form');
const bookmarkInput = bookmarkForm.querySelector('input[type=text]');
const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
const apiUrl = 'https://opengraph.io/api/1.1/site/';
const appId = 'get your own';

function createBookmark(e) {
    e.preventDefault();

    if (!bookmarkInput.value) {
        alert('We need info!');
        return;
    }
    const url = encodeURIComponent(bookmarkInput.value);

    fetch(`${apiUrl}${url}?app_id=${appId}`)
        .then(response => response.json())
        .then(data => {
            const bookmark = {
                title: data.hybridGraph.title,
                image: data.hybridGraph.image,
                link: data.hybridGraph.url,
            };

            bookmarks.push(bookmark);
            fillBookmarksList(bookmarks);
            storeBookmarks(bookmarks);
            bookmarkForm.reset();
        })
        .catch(error => {
            alert('There was a problem getting info!');
        });

    // const title = bookmarkInput.value;
    // const bookmark = document.createElement('a');
    // bookmark.className = 'bookmark';
    // bookmark.innerText = title;
    // bookmark.href = '#';
    // bookmark.target = '_blank';
    // bookmarksList.appendChild(bookmark);
}

function fillBookmarksList(bookmarks = []) {
    const bookmarksHtml = bookmarks.map((bookmark, i) => {
        return `
            <div class="bookmark" data-id="${i}">
                <a href="${bookmark.link}" target="_blank" class="img" style="background-image: url('${bookmark.image}')"></a>
                <a href="${bookmark.link}" target="_blank" class="title">${bookmark.title}</a>
                <span class="glyphicon glyphicon-remove"></span>
            </div>
        `;
    }).join('');

    bookmarksList.innerHTML = bookmarksHtml;

    // let bookmarksHtml = '';

    // for (let i = 0; i < bookmarks.length; i++) {
    //     bookmarksHtml += `
    //     <a href="#" class="bookmark">
    //         ${bookmarks[i].title}
    //     </a>
    //     `;
    // }
}

function storeBookmarks(bookmarks = []) {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

function removeBookmark(e) {
    if (!e.target.matches('.glyphicon-remove')) return;

    const index = e.target.parentNode.dataset.id;

    bookmarks.splice(index, 1);
    fillBookmarksList(bookmarks)
    storeBookmarks(bookmarks);
}

fillBookmarksList(bookmarks);

bookmarkForm.addEventListener('submit', (event) => {
    createBookmark(event);
    closeFloater(event);
});
bookmarksList.addEventListener('click', removeBookmark);