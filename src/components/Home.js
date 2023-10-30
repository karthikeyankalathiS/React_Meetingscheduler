import Navbar from "./Navbar";

function Home() {
  return (
    <div className="App">
       <Navbar />
       <div class="container mt-5">
         <h5 class="heading text-center text-white">MEETING <span style={{color: "#0DF1DB"}}> DASHBOARD</span></h5>
       </div>
    </div>
  );
}

export default Home;
