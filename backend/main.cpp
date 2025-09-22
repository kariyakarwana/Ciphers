#include "httplib.h"
#include <iostream>
#include <string>
#include <vector>
#include <nlohmann/json.hpp>

using namespace std;
using json = nlohmann::json;

// ---------------- Utility ----------------
string sanitize(string text) {
    string result;
    for (char c : text) {
        if (isalpha(c)) result += toupper(c);
    }
    return result;
}

// ---------------- Caesar ----------------
string caesarCipher(string text, int shift, bool encode) {
    string result;
    text = sanitize(text);
    shift = (shift % 26 + 26) % 26;

    for (char c : text) {
        if (encode)
            result += char((c - 'A' + shift) % 26 + 'A');
        else
            result += char((c - 'A' - shift + 26) % 26 + 'A');
    }
    return result;
}

// ---------------- Vigenere ----------------
string vigenereCipher(string text, string keyword, bool encode) {
    string result;
    text = sanitize(text);
    keyword = sanitize(keyword);

    int keywordLen = keyword.size();
    if (keywordLen == 0) return "";

    for (int i = 0; i < text.size(); i++) {
        int shift = keyword[i % keywordLen] - 'A';
        if (encode)
            result += char((text[i] - 'A' + shift) % 26 + 'A');
        else
            result += char((text[i] - 'A' - shift + 26) % 26 + 'A');
    }
    return result;
}

// ---------------- Playfair ----------------
vector<vector<char>> generateKeySquare(string keyword) {
    keyword = sanitize(keyword);
    string filtered;
    vector<bool> seen(26, false);

    for (char c : keyword) {
        if (c == 'J') c = 'I';
        if (!seen[c - 'A']) {
            filtered += c;
            seen[c - 'A'] = true;
        }
    }
    for (char c = 'A'; c <= 'Z'; c++) {
        if (c == 'J') continue;
        if (!seen[c - 'A']) {
            filtered += c;
            seen[c - 'A'] = true;
        }
    }

    vector<vector<char>> square(5, vector<char>(5));
    for (int i = 0; i < 25; i++) {
        square[i / 5][i % 5] = filtered[i];
    }
    return square;
}

pair<int,int> findPosition(vector<vector<char>>& square, char c) {
    if (c == 'J') c = 'I';
    for (int i = 0; i < 5; i++)
        for (int j = 0; j < 5; j++)
            if (square[i][j] == c) return {i, j};
    return {-1,-1};
}

vector<string> createDigraphs(string text) {
    text = sanitize(text);
    for (char &c : text) if (c == 'J') c = 'I';

    vector<string> digraphs;
    for (int i = 0; i < text.size();) {
        char a = text[i];
        char b = (i+1 < text.size()) ? text[i+1] : 'X';
        if (a == b) {
            digraphs.push_back(string(1, a) + "X");
            i++;
        } else {
            digraphs.push_back(string(1, a) + string(1, b));
            i += 2;
        }
    }
    if (!digraphs.empty() && digraphs.back().size() == 1) digraphs.back() += 'X';
    return digraphs;
}

string playfairCipher(string text, string keyword, bool encode) {
    auto square = generateKeySquare(keyword);
    auto digraphs = createDigraphs(text);
    string result;

    for (auto dg : digraphs) {
        auto [r1, c1] = findPosition(square, dg[0]);
        auto [r2, c2] = findPosition(square, dg[1]);

        if (r1 == r2) {
            if (encode) {
                result += square[r1][(c1+1)%5];
                result += square[r2][(c2+1)%5];
            } else {
                result += square[r1][(c1+4)%5];
                result += square[r2][(c2+4)%5];
            }
        } else if (c1 == c2) {
            if (encode) {
                result += square[(r1+1)%5][c1];
                result += square[(r2+1)%5][c2];
            } else {
                result += square[(r1+4)%5][c1];
                result += square[(r2+4)%5][c2];
            }
        } else {
            result += square[r1][c2];
            result += square[r2][c1];
        }
    }
    return result;
}

// ---------------- Playfair Cleanup ----------------
string cleanPlayfairOutput(string decoded) {
    string result;
    for (int i = 0; i < decoded.size(); i++) {
        if (i > 0 && i < decoded.size()-1 &&
            decoded[i] == 'X' &&
            decoded[i-1] == decoded[i+1]) {
            // skip filler X
            continue;
        }
        result += decoded[i];
    }
    // remove possible padding X at the end
    if (!result.empty() && result.back() == 'X') {
        result.pop_back();
    }
    return result;
}

// ---------------- Main ----------------
int main() {
    httplib::Server svr;

    // ---------------- CORS Handling ----------------
    svr.Options("/cipher", [](const httplib::Request&, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        res.set_header("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.status = 200;
    });

    svr.Post("/cipher", [](const httplib::Request& req, httplib::Response& res) {
        // CORS header
        res.set_header("Access-Control-Allow-Origin", "*");

        try {
            auto body = json::parse(req.body);
            string method = body["method"];
            string mode = body["mode"];
            string text = body["text"];
            string key = body["key"];

            bool encode = (mode == "encode");
            string result;

            if (method == "caesar") {
                int shift = stoi(key);
                result = caesarCipher(text, shift, encode);
            } else if (method == "vigenere") {
                result = vigenereCipher(text, key, encode);
            } else if (method == "playfair") {
                result = playfairCipher(text, key, encode);
                if (!encode) result = cleanPlayfairOutput(result); // cleanup when decoding
            } else {
                result = "Invalid method";
            }

            res.set_content(json{{"result", result}}.dump(), "application/json");
        } catch (exception& e) {
            res.set_content(json{{"error", e.what()}}.dump(), "application/json");
        }
    });

    cout << "Server running on http://localhost:8080\n";
    svr.listen("0.0.0.0", 8080);
}
