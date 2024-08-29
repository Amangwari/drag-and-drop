document.addEventListener('DOMContentLoaded', () => {
    const inputData = {
        categorise: [
            {
                unhealthy: 'ice Cream|pasta|burgur|Pizza',
                healthy: 'salad|fruits|veggies',
            }
        ]
    };

    function initializeCategories(data) {
        const wrapper = document.getElementById('wrapper');
        wrapper.innerHTML = ''; // Clear existing content

        // Create options container
        const optionsDiv = document.createElement('div');
        optionsDiv.id = 'options';
        optionsDiv.className = 'drop-container options_container';
        // optionsDiv.textContent = 'Options';
        wrapper.appendChild(optionsDiv);

          // Create categories container
          const categoriesDiv = document.createElement('div');
          categoriesDiv.className = 'categories';
  
          // Create outer div for each category and append it
          data.categorise.forEach(category => {
              for (const [key, items] of Object.entries(category)) {
                  const outerDiv = document.createElement('div');
                  outerDiv.className = 'outerdiv';
  
                  const headingDiv = document.createElement('div');
                  headingDiv.className = 'heading__div';
  
                  const categoryDiv = document.createElement('div');
                  categoryDiv.id = key;
                  categoryDiv.className = 'drop-container category_cont';
                  const categoryHeader = document.createElement('h2');
                  categoryHeader.textContent = key.charAt(0).toUpperCase() + key.slice(1);
                  headingDiv.appendChild(categoryHeader);
  
                  outerDiv.appendChild(headingDiv);
                  outerDiv.appendChild(categoryDiv);
                  categoriesDiv.appendChild(outerDiv);
  
                  // Populate category container with items
                  items.split('|').forEach(item => {
                      const div = document.createElement('div');
                      div.textContent = item;
                      div.className = 'item';
                      div.draggable = true;
                      div.dataset.category = key;
                      optionsDiv.appendChild(div);
                  });
              }
          });
  
          wrapper.appendChild(categoriesDiv);

        // Create and append check button
        const checkButton = document.createElement('button');
        checkButton.id = 'checkButton';
        checkButton.textContent = 'Check Answers';
        checkButton.disabled = true; // Initially disabled
        wrapper.appendChild(checkButton);

        // Create and append result div
        const resultDiv = document.createElement('div');
        resultDiv.id = 'result';
        wrapper.appendChild(resultDiv);

        addDragAndDropEventListeners();
    }

    function addDragAndDropEventListeners() {
        const containers = document.querySelectorAll('.drop-container');

        containers.forEach(container => {
            container.addEventListener('dragover', (e) => {
                e.preventDefault(); // Allows for drop
                e.dataTransfer.dropEffect = 'move'; // Show move cursor
            });

            container.addEventListener('drop', (e) => {
                e.preventDefault();
                const item = document.querySelector('.item.dragging');
                if (item) {
                    container.appendChild(item); // Move item to new container
                    item.classList.remove('dragging');
                    item.style.opacity = '1'; // Reset opacity after drop
                    checkAllCategorized(); // Check if all items are categorized
                }
            });
        });

        // Add drag event listeners to all items
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('item')) {
                e.target.classList.add('dragging');
                e.target.style.opacity = '0.5'; // Visual feedback during drag
                e.dataTransfer.effectAllowed = 'move';
            }
        });

        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('item')) {
                e.target.classList.remove('dragging');
                e.target.style.opacity = '1'; // Reset opacity after drag ends
            }
        });
    }

    function checkAllCategorized() {
        const options = document.getElementById('options');
        const containers = document.querySelectorAll('.drop-container');
        const allItems = Array.from(options.children).filter(child => child.classList.contains('item')).length;

        // Check if all items are in category containers
        const allInCategoryContainers = Array.from(containers).every(container => {
            if (container.id !== 'options') {
                const items = Array.from(container.children).filter(child => child.classList.contains('item')).length;
                return items > 0;
            }
            return true;
        });

        // Enable the button if all items are categorized and none are left in the options container
        document.getElementById('checkButton').disabled = !allInCategoryContainers || allItems > 0;
    }

    function checkAnswers() {
        const containers = document.querySelectorAll('.drop-container');
        let correctCount = 0;

        containers.forEach(container => {
            if (container.id !== 'options') {
                const items = Array.from(container.children).filter(child => child.classList.contains('item')).map(item => item.textContent);
                const category = container.id;
                const correctItems = inputData.categorise[0][category].split('|');

                correctItems.forEach(item => {
                    if (items.includes(item)) {
                        correctCount++;
                    }
                });
            }
        });

        document.getElementById('result').textContent = `Correct items: ${correctCount} out of ${Array.from(document.querySelectorAll('.item')).length}`;
    }

    // Initialize categories and items on load
    initializeCategories(inputData);

    // Event listener for check button
    document.getElementById('checkButton').addEventListener('click', checkAnswers);
});
