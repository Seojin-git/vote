from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = "supersecretkey"  # 세션에 사용되는 비밀 키

# 관리자 비밀번호
ADMIN_PASSWORD = "05190519"

# 투표 데이터
votes = {"agree": 0, "disagree": 0}

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/vote', methods=['POST'])
def vote():
    vote_type = request.form.get("vote")
    if vote_type == "agree":
        votes["agree"] += 1
    elif vote_type == "disagree":
        votes["disagree"] += 1
    return redirect(url_for("home"))

@app.route('/admin', methods=['GET', 'POST'])
def admin():
    if request.method == 'POST':
        password = request.form.get("password")
        if password == ADMIN_PASSWORD:
            session['admin'] = True
            return redirect(url_for("results"))
        else:
            return "<h1>비밀번호가 잘못되었습니다.</h1><a href=\"/admin\">다시 시도</a>"

    return render_template("admin.html")

@app.route('/results')
def results():
    if session.get('admin'):
        return render_template("results.html", votes=votes)
    return redirect(url_for("admin"))

@app.route('/logout')
def logout():
    session.pop('admin', None)
    return redirect(url_for("home"))

if __name__ == '__main__':
    app.run(debug=True)
