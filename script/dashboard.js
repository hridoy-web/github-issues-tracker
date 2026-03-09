// 01- get the html element
const issueContainer = document.getElementById('issue-container');
const issueCount = document.getElementById('total-issue-count');

// 1-1: get the tabs button
const allBtn = document.getElementById('btn-all')
const openBtn = document.getElementById('btn-open')
const closedBtn = document.getElementById('btn-closed')

// 1-2: get the search input
const searchInput = document.getElementById('search-input')

// 02- All issue Api data fatch function 
const loadAllIssues = (status = 'all') => {
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

        // 3-7: card inner design
        newCardDiv.innerHTML = `
<div>
                <div class="flex justify-between mb-2">
                <span class="text-gray-400 text-xs">#${issue.id}</span>
                    <span class="bg-orange-100 text-orange-600 px-2 py-1 rounded text-[10px] font-bold uppercase">${issue.priority}</span>
                    
                </div>
                <h2 class="font-bold text-gray-800 mb-2 line-clamp-1">${issue.title}</h2>
                <p class="text-gray-500 text-xs mb-4 line-clamp-2">${issue.description}</p>
                <div class="badge badge-outline text-[10px] py-3 mb-4">${issue.label}</div>
            </div>
            
            <div class="border-t border-gray-100 pt-3 flex flex-col gap-1 text-[10px] text-gray-400">
                <span>By <span class="font-semibold text-gray-700">${issue.author}</span></span>
                <span>${issue.createdAt}</span>
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

    // 6-1: api call
    const url = 'https://phi-lab-server.vercel.app/api/v1/lab/issues'
    fetch(url)
        .then((res) => res.json())
        .then(obj => {

            const allIssues = obj.data;

            // filtering 
            const search = allIssues.filter(issue => 
                issue.title.toLowerCase().includes(searchText) ||
                issue.description.toLowerCase().includes(searchText)
);
    displayIssues(search)

})
})

// function call
loadAllIssues()




