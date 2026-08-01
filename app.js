const artboard = document.querySelector('#artboard');
    const selectCasual = document.querySelector('#selectCasual');
    const selectThinking = document.querySelector('#selectThinking');
    const selectBetter = document.querySelector('#selectBetter');
    const artwork = document.querySelector('#artwork');
    const optionOneGraphic = document.querySelector('#optionOneGraphic');
    const optionThreeGraphic = document.querySelector('#optionThreeGraphic');
    const submitChoice = document.querySelector('#submitChoice');
    const loadingScreen = document.querySelector('#loadingScreen');
    const resultPage = document.querySelector('#resultPage');
    const reselectPage = document.querySelector('#reselectPage');
    const resultBack = document.querySelector('#resultBack');
    const resultRepick = document.querySelector('#resultRepick');
    const resultShare = document.querySelector('#resultShare');
    const sharePage = document.querySelector('#sharePage');
    const shareClose = document.querySelector('#shareClose');
    const shareFriend = document.querySelector('#shareFriend');
    const saveLocal = document.querySelector('#saveLocal');
    const memeImage = document.querySelector('#memeImage');
    const memeClose = document.querySelector('#memeClose');
    const exhaustedClose = document.querySelector('#exhaustedClose');
    const sharedCounters = document.querySelectorAll('.shared-counter');
    const chanceHint = document.querySelector('#chanceHint');
    let chances = 9;
    let currentResultFile = 'result.svg';
    let closeMemeToResult = false;
    const controls = [selectCasual, selectThinking, selectBetter];

    function replaySvg(image, file) {
      image.src = `${file}?play=${Date.now()}`;
    }

    function animateThinkingEyes(target = artwork) {
      const svg = target.contentDocument?.querySelector('svg');
      const scene = svg?.querySelector('g[clip-path]');
      if (!scene) return;
      [...scene.children].forEach((node) => {
        if (!(node instanceof svg.ownerDocument.defaultView.SVGGraphicsElement)) return;
        try {
          const box = node.getBBox();
          const centerX = box.x + box.width / 2;
          const centerY = box.y + box.height / 2;
          if (centerX >= 160 && centerX <= 216 && centerY >= 604 && centerY <= 624 && box.height < 28) {
            node.getAnimations().forEach((animation) => animation.cancel());
            node.animate([
              { transform: 'translate(0px, 0px)' },
              { transform: 'translate(3px, -3px)', offset: .5 },
              { transform: 'translate(0px, 0px)' }
            ], { duration: 1000, easing: 'ease-in-out', fill: 'forwards' });
          }
        } catch (_) {}
      });
    }

    function setChoice(choice) {
      artboard.classList.toggle('option-one-active', choice === 'casual');
      artboard.classList.toggle('option-three-active', choice === 'better');
      controls.forEach((control) => control.setAttribute('aria-pressed', 'false'));
      ({ casual: selectCasual, thinking: selectThinking, better: selectBetter })[choice]
        .setAttribute('aria-pressed', 'true');
    }

    selectCasual.addEventListener('click', () => {
      replaySvg(optionOneGraphic, 'option-1.svg');
      setChoice('casual');
    });
    selectThinking.addEventListener('click', () => {
      setChoice('thinking');
      animateThinkingEyes(artboard.classList.contains('show-reselect') ? reselectPage : artwork);
    });
    selectBetter.addEventListener('click', () => {
      replaySvg(optionThreeGraphic, 'option-3.svg');
      setChoice('better');
    });

    artwork.addEventListener('load', animateThinkingEyes);

    function updateCounters() {
      sharedCounters.forEach((counter) => { counter.textContent = chances; });
      chanceHint.textContent = chances === 0
        ? '看了这么多相信你已经有答案啦，明天再来吧'
        : `快点选好吃饭吧，还有${chances}次机会哦`;
    }

    function spendChance() {
      chances = Math.max(0, chances - 1);
      updateCounters();
    }

    function drawResult() {
      currentResultFile = Math.random() < 0.5 ? 'result.svg' : 'result-2.svg';
      resultPage.data = `${currentResultFile}?pick=${Date.now()}`;
      loadingScreen.classList.remove('is-visible');
      void loadingScreen.offsetWidth;
      loadingScreen.classList.add('is-visible');
      window.setTimeout(() => {
        artboard.classList.remove('show-reselect');
        artboard.classList.add('show-result');
        loadingScreen.classList.remove('is-visible');
      }, 500);
    }

    function showExhausted() {
      artboard.classList.add('show-exhausted');
    }

    submitChoice.addEventListener('click', () => {
      if (chances === 0) {
        showExhausted();
        return;
      }
      spendChance();
      drawResult();
    });

    resultBack.addEventListener('click', () => {
      artboard.classList.remove('show-result');
      artboard.classList.remove('show-reselect');
    });

    resultRepick.addEventListener('click', () => {
      if (chances === 0) {
        showExhausted();
        return;
      }
      artboard.classList.remove('show-result');
      artboard.classList.add('show-reselect');
      setChoice('thinking');
      animateThinkingEyes(reselectPage);
    });

    resultShare.addEventListener('click', () => {
      const shareFile = currentResultFile === 'result.svg'
        ? 'result-share.svg'
        : 'result-2-share.svg';
      sharePage.data = `${shareFile}?view=${Date.now()}`;
      artboard.classList.add('show-share');
    });

    shareClose.addEventListener('click', () => {
      artboard.classList.remove('show-share');
    });

    shareFriend.addEventListener('click', () => {
      closeMemeToResult = true;
      memeImage.src = 'food-meme.jpg?v=1';
      memeImage.alt = '满肚子食物，人才不会空虚';
      artboard.classList.add('show-meme');
    });

    saveLocal.addEventListener('click', () => {
      closeMemeToResult = true;
      memeImage.src = 'saved-meme.jpg?v=1';
      memeImage.alt = '已保存';
      artboard.classList.add('show-meme');
    });

    memeClose.addEventListener('click', () => {
      artboard.classList.remove('show-meme');
      if (closeMemeToResult) {
        artboard.classList.remove('show-share');
      }
    });

    exhaustedClose.addEventListener('click', () => {
      artboard.classList.remove('show-exhausted');
      artboard.classList.remove('show-result');
      artboard.classList.remove('show-reselect');
      artboard.classList.remove('show-share');
      artboard.classList.remove('show-meme');
    });
