// 01- get the html element
const issueContainer = document.getElementById('issue-container');
const issueCount = document.getElementById('total-issue-count');

// 1-1: get the tabs button
const allBtn = document.getElementById('btn-all')
const openBtn = document.getElementById('btn-open')
const closedBtn = document.getElementById('btn-closed')

// 1-2: get the search input
const searchInput = document.getElementById('search-input')

// loading spinner function
const loadingSpinner = (loading) => {

    // get the container
    const spinnerContainer = document.getElementById('loading-spinner');

    // condition apply
    if (loading) {
        spinnerContainer.classList.remove('hidden')
        issueContainer.classList.add('hidden')
    } else {
        spinnerContainer.classList.add('hidden');
        issueContainer.classList.remove('hidden');
    }
}

// 02- All issue Api data fatch function 
const loadAllIssues = (status = 'all') => {

    loadingSpinner(true);

    const apiUrl = 'https://phi-lab-server.vercel.app/api/v1/lab/issues';
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {

            const allIssues = data.data;

            // 2-1: filter conditon
            if (status === 'all') {
                displayIssues(allIssues)
            } else {
                const filtering = allIssues.filter(issue => issue.status === status);
                displayIssues(filtering)
            }

            tabStyle(status);

            loadingSpinner(false);
        })
}

//03- data load Display -- function
const displayIssues = (issues) => {

    // 3-1: first container empty
    issueContainer.innerHTML = "";

    // 3-2: total issue counter update 
    issueCount.innerText = issues.length;

    // 3-3: loop to create card
    issues.forEach(issue => {

        // 3-4: card border status --- condition
        const cardBorder = issue.status === 'open' ? 'border-t-green-500' : 'border-t-purple-500';

        // 3-5: New Card Create
        const newCardDiv = document.createElement('div');

        // 3-6: parent div card design
        newCardDiv.className = `card bg-white p-4 shadow-md rounded-lg border-t-4 ${cardBorder} h-full flex flex-col justify-between`

        // 3-9: modal click event set
        newCardDiv.setAttribute('onclick', `showModalDetails('${issue.id}')`);

        // 3-7: daisyUi level badge
        const labelsBox = issue.labels.map(label =>
            `<div class="badge badge-dash badge-primary"><i class="fa-solid fa-circle-info"></i>
  ${label}</div>`
        ).join("");

        // 3-7: card inner design
        newCardDiv.innerHTML = `
<div>
                <div class="flex justify-between mb-2">
                <span class="text-gray-400 text-xs">#${issue.id}</span>
                    <span class="badge badge-outline badge-secondary uppercase">${issue.priority}</span>
                    
                </div>
                <h2 class="font-bold text-gray-800 mb-2 line-clamp-1">${issue.title}</h2>
                <p class="text-gray-500 text-xs mb-4 line-clamp-2">${issue.description}</p>

                <div class="flex flex-wrap gap-1 mb-3">${labelsBox}</div>
            </div>
            
            <div class="border-t border-gray-200 pt-3 flex flex-col gap-1 text-[10px] text-gray-400">
                <span>By <span class="font-semibold text-gray-700">${issue.author}</span></span>
                <span>${new Date(issue.createdAt).toLocaleDateString()}</span>
            </div>
`
        // 3-8: append to container
        issueContainer.append(newCardDiv)
    });
}

// 04:- tab button active style control function
const tabStyle = (status) => {

    // 4-1: first remove active style
    allBtn.classList.remove('btn-primary')
    openBtn.classList.remove('btn-primary')
    closedBtn.classList.remove('btn-primary')

    // 4-2: clicked tab background color change
    if (status === 'all') {
        allBtn.classList.add('btn-primary')
    } else if (status === 'open') {
        openBtn.classList.add('btn-primary')
    } else if (status === 'closed') {
        closedBtn.classList.add('btn-primary')
    }
}

// 05: eventlistener click function
allBtn.addEventListener('click', () => loadAllIssues('all'))
openBtn.addEventListener('click', () => loadAllIssues('open'))
closedBtn.addEventListener('click', () => loadAllIssues('closed'))


// 06: search function
searchInput.addEventListener('keyup', (event) => {
    // user data collect
    const searchText = event.target.value.toLowerCase();

    if (searchText === "") {
        loadAllIssues();
        return;
    }

    // 6-1: api call
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`;
    fetch(url)
        .then((res) => res.json())
        .then(obj => {

            displayIssues(obj.data);
        })
})

//07: modal function
const showModalDetails = (id) => {
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
        .then(res => res.json())
        .then(data => {
            const issue = data.data;

            // 7-1: get the Element
            document.getElementById('modal-title').innerText = issue.title;
            document.getElementById('modal-description').innerText = issue.description;
            document.getElementById('modal-status').innerText = issue.status;
            document.getElementById('modal-author').innerText = `Opened by ${issue.author}`;
            document.getElementById('modal-priority').innerText = issue.priority;

            // 7-1: modal status change 
            const modalStatus = document.getElementById("modal-status")
            modalStatus.innerText = issue.status;

            // 7-2: update modal badge color status 
            if (issue.status === 'open') {
                modalStatus.className = "badge badge-success"
            } else {
                modalStatus.className = "badge badge-error"
            }

            // 7-3: showing level on modal
            const modalLabels = document.getElementById('modal-labels');
            // 7-4; map function
            modalLabels.innerHTML = issue.labels.map(labels =>
                `<span class="badge badge-soft badge-primary capitalize">${labels}</span>`
            ).join("");

            //7-5- open modal
            const modal = document.getElementById('show-modal');
            modal.showModal();

        })
}

// function call
loadAllIssues()




