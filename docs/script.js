;(function () {
  'use strict'

  const get = (target) => document.querySelector(target);

  // 시작
  const init = () => {
    get('form').addEventListener('submit', (e) => {
      playGame(e)
    })
    setPassword()
  }

  // 옵션 객체
  const baseball = {
    limit: 10, // 시도 제한 횟수
    digit: 4, // 숫자 자릿수
    trial: 0, // 현재 시도 횟수
    end: false, // 종료 여부
    $question: get('.ball_question'),
    $answer: get('.ball_answer'),
    $input: get('.ball_input'),
  }


  // 객체 안의 key들을 destructuring(구조분해할당), 바뀌는 값은 let
  const {limit, digit, $question, $answer, $input} = baseball;
  let {trial, end} = baseball;


  // 정답 값을 지정
  const setPassword = () => {
    const gameLimit = Array(limit).fill(false); // false로 채워진 크기 10 배열
    let password = ''
    while (password.length < digit) {
      const random = parseInt(Math.random() * 10, 10) // 10진수 랜덤 수 생성

      if (gameLimit[random]) {
        continue;
      }
      password += random; // 각각의 칸에 랜덤 수 입력
      gameLimit[random] = true;
    }

    // 반복문 종료 후, 생성된 정답 값을 할당
    baseball.password = password
    console.log(password); // console에 정답 노출
  }


  // 시도 결과 HTML 반환
  const onPlayed = (number,hint) => {
    // number: 내가 입력한 숫자
    // hint: 현재 어떤 상황인지
    return `<em>${trial}차 시도</em>: ${number}, ${hint}`;
  }


  // 정답여부
  const isCorrect = (number, answer) => {
    return number === answer
  }


  // 중복 체크
  const isDuplicated = (number) => {
    // new Set() : 새로운 배열을 중복없이 반환
    // 중복이 있다면 자릿수 4보다 작은 값이 되는 것을 이용
    return [...new Set(number.split(''))].length !== digit
  }


  // 스트라이크 수
  const getStrikes = (number, answer) => {
    let strike = 0
    const nums = number.split('')

    nums.map((digit, index) => {
      if (digit === answer[index]) {
        strike++
      }
    })
    return strike;
  }


  // 볼 수
  const getBalls = (number, answer) => {
    let ball = 0
    const nums = number.split('')
    const gameLimit = Array(limit).fill(false);

    answer.split('').map((num) => {
      gameLimit[num] = true
    })
    
    nums.map((num,index) => {
      if (answer[index] !== num && !!gameLimit[num]) {
        ball++
      }
    })
    return ball;
  }


  // 시도에 따른 결과
  const getResult = (number, answer) => {
    if (isCorrect(number,answer)) {
      end = true
      $answer.innerHTML = baseball.password
      $answer.style.display ="block"; // 결과 노출
      return '홈런!!'
    }
    const strikes = getStrikes(number,answer);
    const balls = getBalls(number,answer);
    return 'STRIKE: '+strikes + ', BALL: '+balls;
  }


  // 게임 플레이 
  const playGame = (e) => {
    e.preventDefault();

    if (!!end) {
      return;
    }
    const inputNumber = $input.value;
    const {password} = baseball // 실제 정답 값
    
    if (inputNumber.length !== digit) {
      alert(`${digit}자리 숫자를 입력해주세요.`)
    }
    else if (isDuplicated(inputNumber)) {
      alert(`중복 숫자가 있습니다.`)
    }
    else {
      trial++
      const result = onPlayed(inputNumber, getResult(inputNumber,password))
      $question.innerHTML += `<span>${result}</span>`
      
      if (limit <= trial && !isCorrect(inputNumber,password)) {
        alert('아웃!');
        end = true
        $answer.innerHTML = password;
        $answer.style.display ="block"; // 결과 노출
      }
    }
    // 비워주고 포커싱
    $input.value = ''
    $input.focus();
  }


  // 새로고침
  $answer.addEventListener('click', () => {
    if(confirm('다시 시작할까요?')){
      location.reload()
    }
  });
  get('h1').addEventListener('click',() => {
    if(confirm('다시 시작할까요?')){
    location.reload()
    }
  });


  init();
})()
