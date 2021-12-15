export function endTour() {
  window.music.stop();
  document.getElementsByClassName("babylonVRicon")[0].style.display = "none";
  document.getElementById("renderCanvas").style.display = "none";
  document.getElementById("customLoadingScreenDiv").style.display = "flex";
  document.getElementById("loading-text").innerText = "Tour Completed!";
  document.getElementById("babylonUnmuteIconBtn").innerText = "Restart Tour";
}
