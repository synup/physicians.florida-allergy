"use client";

import { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import { IoReorderThreeOutline } from "react-icons/io5";

export default function PhysicianSearch() {
  const [location, setLocation] = useState("Miami Beach, FL 33140, USA");

  return (
    <>
      <div className="py-[30px] px-[15px] bg-[#f8f9fa]">
        <div className=" container flex justify-between  mx-auto">
          <div>
          <h1 className="text-[#00000080] hidden md:text-start">
            Link to Finder
          </h1>
          </div>
         <div>
          <IoReorderThreeOutline  size={30} />
          </div>
        </div>
      </div>
      <div className="md:flex items-stretch px-[15px]">
        {/* Left Section */}
        <div className="flex flex-col md:w-[500px] max-h-[100vh] pr-2">
          <div className="bg-white rounded-2xl ">
            <h2 className="text-[24px] text-[#373A3C] font-bold my-[8px]">
              Find a Physician near you
            </h2>
            <div className="flex gap-12 justify-between items-center">
              <p className="text-[#373A3C] text-[15px]">
                Enter ZIP Code or City/State
              </p>
              <button className=" px-[12px]  py-[6px] text-[15px] text-[#2780E3] hover:underline">
                Use my Location
              </button>
            </div>
            <div className="flex items-center gap-2 space-x-2 mt-2">
              <input
                className="flex-1 px-[12px] py-[6px] bg-white w-full border rounded-lg"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Search
              </button>
            </div>
            <p className="mt-[15px] text-[15px] text-[#373A3C]">
              25 of 38 near<span className="font-bold"> Miami Beach, FL</span>
            </p>
          </div>

          {/* Scrollable List */}
          <div className="mt-4 bg-white  flex-1 overflow-y-auto">
            <div className="flex gap-3 mb-5 hover:bg-[#eee] p-4 ">
              <div className="text-[15px] text-[#373A3C]">1.</div>
              <div className="w-full">
                <p className="text-[15px] text-[#2780E3] hover:underline hover:text-[#165BA8] font-bold">
                  Stacy M. Nassau, MD
                </p>
                <div className="text-[15px] text-[#373A3C] ">
                  <p className="">
                    <span className="font-[700]">Closed</span> . 8:00AM tomorrow
                  </p>
                  <p>400 Arthur Godfrey Rd.</p>
                  <p>Suite 504</p>
                  <div className="flex justify-between">
                    <p>iami Beach, FL 33140</p>
                    <p>2 mi.</p>
                  </div>
                  <p>US</p>
                  <p>(305) 538-8339</p>
                </div>
                <a className="text-[#2780E3] text-[15px] block cursor-pointer hover:underline">
                  Get Directions
                </a>
                <a className="text-[#2780E3] text-[15px] block cursor-pointer hover:underline">
                  View Details
                </a>
              </div>
            </div>
            <div className="flex gap-3 mb-5 hover:bg-[#eee] p-4">
              <div className="text-[15px] text-[#373A3C]">1.</div>
              <div className="w-full">
                <p className="text-[15px] text-[#2780E3] hover:underline hover:text-[#165BA8] font-bold">
                  Stacy M. Nassau, MD
                </p>
                <div className="text-[15px] text-[#373A3C] ">
                  <p className="">
                    <span className="font-[700]">Closed</span> . 8:00AM tomorrow
                  </p>
                  <p>400 Arthur Godfrey Rd.</p>
                  <p>Suite 504</p>
                  <div className="flex justify-between">
                    <p>iami Beach, FL 33140</p>
                    <p>2 mi.</p>
                  </div>
                  <p>US</p>
                  <p>(305) 538-8339</p>
                </div>
                <a className="text-[#2780E3] text-[15px] block cursor-pointer hover:underline">
                  Get Directions
                </a>
                <a className="text-[#2780E3] text-[15px] block cursor-pointer hover:underline">
                  View Details
                </a>
              </div>
            </div>
            <div className="flex gap-3 mb-5 hover:bg-[#eee] p-4">
              <div className="text-[15px] text-[#373A3C]">1.</div>
              <div className="w-full">
                <p className="text-[15px] text-[#2780E3] hover:underline hover:text-[#165BA8] font-bold">
                  Stacy M. Nassau, MD
                </p>
                <div className="text-[15px] text-[#373A3C] ">
                  <p className="">
                    <span className="font-[700]">Closed</span> . 8:00AM tomorrow
                  </p>
                  <p>400 Arthur Godfrey Rd.</p>
                  <p>Suite 504</p>
                  <div className="flex justify-between">
                    <p>iami Beach, FL 33140</p>
                    <p>2 mi.</p>
                  </div>
                  <p>US</p>
                  <p>(305) 538-8339</p>
                </div>
                <a className="text-[#2780E3] text-[15px] block cursor-pointer hover:underline">
                  Get Directions
                </a>
                <a className="text-[#2780E3] text-[15px] block cursor-pointer hover:underline">
                  View Details
                </a>
              </div>
            </div>
            <div className="flex gap-3 mb-5 hover:bg-[#eee] p-4">
              <div className="text-[15px] text-[#373A3C]">1.</div>
              <div className="w-full">
                <p className="text-[15px] text-[#2780E3] hover:underline hover:text-[#165BA8] font-bold">
                  Stacy M. Nassau, MD
                </p>
                <div className="text-[15px] text-[#373A3C] ">
                  <p className="">
                    <span className="font-[700]">Closed</span> . 8:00AM tomorrow
                  </p>
                  <p>400 Arthur Godfrey Rd.</p>
                  <p>Suite 504</p>
                  <div className="flex justify-between">
                    <p>iami Beach, FL 33140</p>
                    <p>2 mi.</p>
                  </div>
                  <p>US</p>
                  <p>(305) 538-8339</p>
                </div>
                <a className="text-[#2780E3] text-[15px] block cursor-pointer hover:underline">
                  Get Directions
                </a>
                <a className="text-[#2780E3] text-[15px] block cursor-pointer hover:underline">
                  View Details
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className=" flex-1  -mx-[15px] md:mx-[0]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d27438.46165480399!2d76.69611925000001!3d30.723805849999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1740402042113!5m2!1sen!2sin"
            width="100"
            className="min-h-[100vh] w-full h-full"
          ></iframe>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-gray-100 px-[15px] py-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-gray-600">
          {/* Navigation Links */}
          <div className="flex flex-col justify-center items-start mb-4 md:mb-0">
            <div className="flex space-x-6 mb-4 text-[#212529]">
              <a href="#" className="underline hover:no-underline">
                Terms of Service
              </a>
              <a href="#" className="underline hover:no-underline">
                Sitemap
              </a>
            </div>
            {/* Copyright */}
            <p className="text-[15px] text-[#373A3C]">
              © 2018 Cobalt Design System. All Rights Reserved.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-gray-800">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-800">
              <FaLinkedinIn size={20} />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-800">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-800">
              <FaInstagram size={20} />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
