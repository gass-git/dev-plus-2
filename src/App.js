import React, {useState, useEffect } from 'react';
import './global/App.css';
import ScrollDisplay from './components/scrollDisplay/index';
import MainMenu from './components/mainMenu/index';
import BasicInfo from './components/basicInfo/index';
import Projects from './components/projects/index';
import Skills from './components/skills/index';
import About from './components/about/index';
import Activity from './components/activity/index';

let answers_api = "https://api.stackexchange.com/2.3/users/14895985/answers?order=desc&sort=activity&site=stackoverflow";
let events_api = "https://api.github.com/users/gass-git/events/public";
let repos_api = "https://api.github.com/users/gass-git/repos";

const App = () => {
  var [selected, setSelected] = useState('about');
  var [answers, setAnswers] = useState([]);
  var [gitEvents, setGitEvents] = useState([]);
  var [repos, setRepos] = useState([]);

  async function getGitEvents() {
    var req = await fetch(events_api), 
      respArray = await req.json(),
      latestFive = respArray.slice(0,4); 
    setGitEvents(latestFive);
  }

  async function getRepos() {
    var req = await fetch(repos_api),
      respArray = await req.json();
    setRepos(respArray);
  }

  async function get_SO_data(){
    
    // Get answers data
    let req = await fetch(answers_api);
    let resp = await req.json();
    var answersArr = resp.items.slice(0, 4);
    let merged = [];

    // Get questions title
    answersArr.forEach(async function(answer, index){
        
      var id = answer.question_id;
      let questions_api = `https://api.stackexchange.com/2.3/questions/${id}?order=desc&sort=activity&site=stackoverflow`;
      let req = await fetch(questions_api);
      let resp = await req.json();
      let title = resp.items[0].title;

        merged.push({
         ...answersArr[index], 
         ...{'title' : title}
        });
      
    }) 
    
      setAnswers(merged);
  };

  useEffect(() => {
    getGitEvents();
    get_SO_data();
  }, []);

  return (
    <div className="main-wrapper">
      
      {/* -- FIRST ROW -- */}
      {/*<section className="first-row">
        <ScrollDisplay />
      </section>

      {/* -- SECOND ROW -- */}
      <section className="second-row">
        <div className="left-side">
          <MainMenu selected={selected} setSelected={setSelected}/>
        </div>
        <div className="right-side">
          <BasicInfo />
        </div>
      </section>

      {/* -- THIRD ROW --  */}
      <section className="third-row">
        <div className="content-display">
          <div className="border-img">
            <div className="inner-container">
              {selected === "about" ? <About /> : null}
              {selected === "skills" ? <Skills /> : null} 
              {selected === "projects" ? <Projects /> : null}
              {selected === "activity" ? <Activity answers={answers} gitEvents={gitEvents} /> : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
