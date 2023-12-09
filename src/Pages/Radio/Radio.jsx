import React, { useEffect, useState } from "react";
import MainHeading from "../../Shared/components/MainHeading";
import axios from "axios";
import "./style/radio.css";
import { FaSearch, FaRegPlayCircle, FaRegPauseCircle } from "react-icons/fa";
import Loader from "./../../Shared/components/Loader";
import MainHeader from "./../../Shared/components/MainHeader";
import AudioPlayer from "react-h5-audio-player";
import Alert from "./../../Shared/components/Alert";

export const Radio = () => {
  const breadcrumb = {
    الرئيسية: "/",
    الراديو: "/quran",
  };

  const [radio, setRadio] = useState({
    loading: false,
    channels: [],
    errMsg: null,
    url: null,
    playingChannelId: null,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioVisible, setIsAudioVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    setRadio({ ...radio, loading: true });
    axios
      .get("https://mp3quran.net/api/v3/radios")
      .then((res) => {
        setRadio({
          loading: false,
          channels: res.data.radios,
          errMsg: null,
        });
      })
      .catch((err) => {
        setRadio({
          loading: false,
          channels: null,
          errMsg: "err.message",
        });
      });
  }, []);

  const channelElement =
    radio.channels.length !== 0 &&
    radio.channels
      .filter((channel) =>
        channel.name.toLowerCase().includes(searchInput.toLowerCase())
      )
      .map((channel) => {
        return (
          <div key={channel.id} className="channel main-btn">
            {channel.name}
            <button
              onClick={() => {
                handleAudio(channel.url, channel.id);
              }}
              className="play-btn"
              title="الأستماع الي الاذاعة"
            >
              {radio.playingChannelId === channel.id && isPlaying ? (
                <FaRegPauseCircle />
              ) : (
                <FaRegPlayCircle />
              )}
            </button>
          </div>
        );
      });

  const handleAudio = (url, channelId) => {
    setRadio({ ...radio, url: url, playingChannelId: channelId });
    setIsAudioVisible(true);
    setIsPlaying(true);
  };

  const audioElement = () => {
    const audioSrc = radio.url;
    return isAudioVisible ? (
      <AudioPlayer
        src={audioSrc}
        className="audio-element"
        autoPlay={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsAudioVisible(false)}
      />
    ) : null;
  };

  const handleSearch = (e) => {
    const input = e.target.value;
    setSearchInput(input);
  };
  return (
    <section className="radio-section">
      <MainHeading breadcrumb={breadcrumb} title="الراديو" />
      <section className="radio">
        <div className="container">
          <MainHeader
            Header={"اِستمَع إِلى إِذاعَات إِسْلاميَّة مُتَنوعَة"}
            smHeader={"الإذاعات الإسْلاميَّة"}
          />
          <div className="search-box">
            <button className="search-btn">
              <FaSearch />
            </button>
            <input
              type="search"
              name=""
              id=""
              placeholder="ادخل اسم الإذاعة ..."
              value={searchInput}
              onChange={handleSearch}
            />
          </div>
          {radio.channels.length === 0 && radio.loading && <Loader />}
          <div className="channels">
            {radio.channels.length !== 0 && !radio.loading && channelElement}
          </div>
          {channelElement.length === 0 && (
            <Alert
              msg={`لا يوجد إذاعة بهذا الاسم "${searchInput}"`}
              variant={"warning"}
            />
          )}
        </div>
        <div className="radio-audio">{audioElement()}</div>
      </section>
    </section>
  );
};
