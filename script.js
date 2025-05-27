// Word slider functionality
document.addEventListener('DOMContentLoaded', function() {
    const words = [
        'developer',
        'designer',
        'creator',
        'innovator',
        'problem solver',
        'builder',
        'dreamer'
    ];
    
    const dynamicWordElement = document.getElementById('dynamicWord');
    let currentWordIndex = 0;
    
    function typeWord(word, callback) {
        let currentChar = 0;
        dynamicWordElement.textContent = '';
        
        const typeInterval = setInterval(() => {
            if (currentChar < word.length) {
                dynamicWordElement.textContent += word[currentChar];
                currentChar++;
            } else {
                clearInterval(typeInterval);
                setTimeout(callback, 2000);
            }
        }, 100);
    }
    
    function eraseWord(callback) {
        const currentText = dynamicWordElement.textContent;
        let currentLength = currentText.length;
        
        const eraseInterval = setInterval(() => {
            if (currentLength > 0) {
                dynamicWordElement.textContent = currentText.substring(0, currentLength - 1);
                currentLength--;
            } else {
                clearInterval(eraseInterval);
                setTimeout(callback, 500);
            }
        }, 50);
    }
    
    function nextWord() {
        currentWordIndex = (currentWordIndex + 1) % words.length;
        typeWord(words[currentWordIndex], () => {
            eraseWord(nextWord);
        });
    }
    
    setTimeout(() => {
        eraseWord(nextWord);
    }, 3000);
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    console.log('🎉 MUI Word Slider POC - GitHub Pages Deployment Successful!');
}); 