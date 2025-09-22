import { useState } from "react";
import MatrixRain from "./MatrixRain";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { Terminal } from "lucide-react";
import img1 from "./assets/cipherring.png";

import "./App.css";

function App() {
  const [method, setMethod] = useState("caesar");
  const [mode, setMode] = useState("encode");
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/cipher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method, mode, text, key }),
    });
    const data = await res.json();
    setResult(data.result || data.error);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-green-400 p-4 relative overflow-hidden">
      <MatrixRain />
      {/* Hacker Matrix background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,255,0,0.1)_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>

      {/* Content with Image + Card */}
      <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
        {/* Cipher Ring Image */}
        <img
          src={img1}
          alt="Cipher Ring"
          className="w-100 h-100 object-contain drop-shadow-[0_0_15px_rgba(0,255,0,0.8)] mr-30"
        />

        {/* Main Card */}
        <Card className="w-[450px] p-6 bg-neutral-900 border border-green-500/50 text-green-300 shadow-[0_0_25px_rgba(0,255,0,0.5)] justify-between">
          <CardHeader>
            <CardTitle className="text-2xl text-green-400">
              Cipher Tool 🔐
            </CardTitle>
            <CardDescription className="text-green-500">
              Select a method to encode or decode your secret messages.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="grid w-full items-center gap-6">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="method" className="text-green-400">
                    Cipher Method
                  </Label>
                  <Select onValueChange={setMethod} defaultValue={method}>
                    <SelectTrigger
                      id="method"
                      className="bg-black border-green-500 text-green-400"
                    >
                      <SelectValue placeholder="Select a cipher" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border border-green-500 text-green-300 shadow-[0_0_15px_rgba(0,255,0,0.6)]">
                      <SelectItem 
                        value="caesar" 
                        className="hover:bg-green-700 hover:text-black focus:bg-green-600 focus:text-black"
                      >
                        Caesar Cipher
                      </SelectItem>
                      <SelectItem 
                        value="vigenere" 
                        className="hover:bg-green-700 hover:text-black focus:bg-green-600 focus:text-black"
                      >
                        Vigenere Cipher
                      </SelectItem>
                      <SelectItem 
                        value="playfair" 
                        className="hover:bg-green-700 hover:text-black focus:bg-green-600 focus:text-black"
                      >
                        Playfair Cipher
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="mode" className="text-green-400">
                    Mode
                  </Label>
                  <Select onValueChange={setMode} defaultValue={mode}>
                    <SelectTrigger
                      id="mode"
                      className="bg-black border-green-500 text-green-400"
                    >
                      <SelectValue placeholder="Select a mode" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border border-green-500 text-green-300 shadow-[0_0_15px_rgba(0,255,0,0.6)]">
                      <SelectItem 
                        value="encode" 
                        className="hover:bg-green-700 hover:text-black focus:bg-green-600 focus:text-black"
                      >
                        Encode
                      </SelectItem>
                      <SelectItem 
                        value="decode" 
                        className="hover:bg-green-700 hover:text-black focus:bg-green-600 focus:text-black"
                      >
                        Decode
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="text" className="text-green-400">
                    Text to Process
                  </Label>
                  <Input
                    id="text"
                    className="bg-black border-green-500 text-green-300 placeholder-green-700"
                    placeholder="Enter your message"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="key" className="text-green-400">
                    {method == "caesar"
                      ? "Shift Value (Numeric Key)"
                      : method == "vigenere"
                      ? "Keyword (Alphabetic Key)"
                      : "Keyword / Phrase"}
                  </Label>
                   <Input
                      id="key"
                      type={method === "caesar" ? "number" : "text"}  // 👈 Dynamically switch input type
                      className="bg-black border-green-500 text-green-300 placeholder-green-700 "
                      placeholder={
                        method === "caesar"
                          ? "Enter numeric key (e.g.: 3)"
                          : "Enter the secret key"
                      }
                      value={key}
                      onChange={(e) => {
                        if (method === "caesar") {
                          // allow only digits (strip other characters)
                          const numericValue = e.target.value.replace(/\D/g, "");
                          setKey(numericValue);
                        } else {
                          setKey(e.target.value);
                        }
                      }}
                      required
                    />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full mt-10 bg-green-600 hover:bg-green-500 text-black font-bold shadow-[0_0_15px_rgba(0,255,0,0.8)]"
              >
                Submit
              </Button>
            </CardFooter>
          </form>

          {result && (
            <div className="p-6 pt-0">
              <Alert className="bg-black border-green-500 text-green-300 shadow-[0_0_10px_rgba(0,255,0,0.7)]">
                <Terminal className="h-4 w-4 text-green-400" />
                <AlertTitle className="text-green-400">Result</AlertTitle>
                <AlertDescription className="break-words">
                  {result}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default App;
