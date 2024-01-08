let sorted = [];
// fetch all data
const loadData = async(limit) => {
    iLoading(true);
    try{
        const response = await fetch('https://openapi.programming-hero.com/api/ai/tools');
        const data = await response.json();
        getNsetData(data.data.tools, limit);
    } catch(error) {
        console.log(error);
    }
    // click to sort (if not clicked, there will go default fetched data from over this)
    document.getElementById('sort').addEventListener('click', function(){
        getNsetData(sorted, limit); // sorted data passed from global array 
    })

}






// get and set data to card
const getNsetData = (tools, limit) => {




    // get card container
    const section = document.getElementById('card-container');
    section.innerHTML = '';
    
    // Limit of data
    const all = tools.slice(0, limit);



    // get n put sorted elements in a global array 
    const sortBy = (a,b) => {
        const dateA = new Date(a.published_in);
        const dateB = new Date(b.published_in);
        if (dateA > dateB ) return 1;
        else if (dateA < dateB ) return -1;
        return 0;
    }
    sorted = tools.sort(sortBy); // tools is array of objects




    // see more button hidding condition
    const seeMoreButton = document.getElementById('see-more');
    if (limit && tools.length > limit) {
        seeMoreButton.classList.remove('hidden');
    } else {
        seeMoreButton.classList.add('hidden');
    }
    

    // loop on array of data
    all.forEach(tool => {
       
        //console.log(tool.id);    
        section.innerHTML += `
        <div class="card w-full bg-[#2A303C] text-white border hover:scale-105 transition hover:shadow-xl">
            <figure>
                <img src="${tool.image}" alt="Shoes" />
            </figure>
            <div class="card-body flex-col justify-between">
                <div>
                    <h3 class="text-white text-2xl font-semibold">Features</h3>
                    <ol id="features-container" class="pl-4" style="list-style: decimal;">
                        ${tool.features ? tool.features.map(f => `<li>${f}</li>`).join("\n") : ''}
                    </ol>
                </div>    
                
                <div class="card-footer flex justify-between items-center border-t-[1px] pt-2">                   
                    <div>
                        <h2 class="text-3xl text-white font-semibold ">${tool.name}</h2>
                        <p class="mt-2"><i class="fa-solid fa-calendar-days"></i>  ${tool.published_in}</p>
                    </div>
                    <label for="my-modal-5" onclick="loadDetails('${tool.id}')" class="bg-base-200 rounded-[50%]"><i class="fa-solid fa-arrow-right p-5"></i></label>
                </div>
            </div>
        </div>
        `;

        iLoading(false);
    })
}

// load details after clicking arrow button
const loadDetails = async(toolId) => {
    mLoading(true);
    const responseDetails = await fetch(`https://openapi.programming-hero.com/api/ai/tool/${toolId}`);
    const data = await responseDetails.json();
    showDetails(data.data);
}


// get and show data on Modal
const modalBody = document.getElementById('modal-body');
const showDetails = (details) => {
    
    modalBody.innerHTML = `
    <label for="my-modal-5" class="btn btn-md btn-circle absolute right-0 top-0 text-white bg-red-700">✕</label>
    <div class="md:flex max-sm:flex-col max-sm:gap-y-2 justify-around md:gap-5">
        <div class="md:w-[50%] w-full md:min-h-[500px] h-auto text-white border hover:bg-base-200 rounded-xl p-5  max-sm:mb-2">
            <h1 class="md:text-2xl text-md font-semibold">${details.description}</h1>
            <div class="text-center flex justify-between items-center gap-x-2 my-10">
                <div class="rounded md:text-xl text-sm bg-gray-500 md:h-[120px] h-[90px] md:w-[150px] w-[90px] flex flex-col justify-center p-2"><p>${details.pricing ? details.pricing[0].price : 'Free of cost'}</p> <p>${details.pricing ? details.pricing[0].plan : 'Basic'}</p></div>
                <div class="rounded md:text-xl text-sm bg-gray-500 md:h-[120px] h-[90px] md:w-[150px] w-[90px] flex flex-col justify-center p-2"><p>${details.pricing ? details.pricing[1].price : 'Free of cost'}</p> <p>${details.pricing ? details.pricing[1].plan : 'Pro'}</p></div>
                <div class="rounded md:text-xl text-sm bg-gray-500 md:h-[120px] h-[90px] md:w-[150px] w-[90px] flex flex-col justify-center p-2"><p>${details.pricing ? details.pricing[2].price : 'Free of cost'}</p> <p>${details.pricing ? details.pricing[2].plan : 'Enterprise'}</p></div>
            </div>
            <div class="flex justify-between">
                <div>
                    <h2 class="text-2xl font-semibold">Features</h2>
                    <div>
                        <p>${details.features['1'] ? details.features['1'].feature_name : 'Coming soon'}</p>
                        <p>${details.features['2'] ? details.features['2'].feature_name : 'Coming soon'}</p>
                        <p>${details.features['3'] ? details.features['3'].feature_name : 'Coming soon'}</p>
                    </div>
                </div>
                <div>
                    <h2 class="text-2xl font-semibold">Integretion</h2>
                    <ul id="intes">
                       ${details.integrations ? details.integrations.map(i => `<li>${i}</li>`).join("\n") : 'No data found'} 
                    </ul>
                </div>
            </div>
        </div>
        <div class="md:w-[50%] w-full md:min-h-[500px] h-auto text-white border hover:bg-base-200 rounded-xl p-5">
            <div class="relative">
                <img class="rounded-xl" src="${details.image_link[0]}" alt="">
                <p class="absolute top-2 right-2 font-semibold rounded-md bg-base-200/70 px-2">${details.accuracy.score ? details.accuracy.score*100 + '% accuracy</span>' : ''}</p>
            </div>
            <h1 class="text-center ms:text-3xl text-xl md:my-5 my-2">${details.input_output_examples ? details.input_output_examples[0].input : 'Can you gave example?'}</h1>
            <p class="text-center">${details.input_output_examples ? details.input_output_examples[0].output : 'No, Not yet. Take a break.'}</p>
        </div>
    </div>
    
    `;
    mLoading(false);
}



// see more
const seeMore = () => {
    loadData(); // loadData has not argument means no limit for showing data
}



// card loader
const loader = document.getElementById('loader');
const iLoading = (loading) => {
    if (loading) {
        loader.classList.remove('hidden');
    } else {
        loader.classList.add('hidden');
    }
}
// modal loader
const mLoader = document.getElementById('modal-loader');
const mLoading = (loading) => {
    if (loading) {
        mLoader.classList.remove('hidden');
    } else {
        mLoader.classList.add('hidden');
    }
}



// default (limited)
loadData(6); // argument is limit of showing default data count