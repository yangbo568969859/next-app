```C#
private void connectWebsocket () {
  Socket socketWatch = new Socekt(AddressFamily,InterNetwork, SocketType.)
  IPAddress ip = IPAddress.Any;
  IPEndPoint point = new IPEndPoint(ip, Convert.ToInt32(txtPort.Text));
  socketWatch.Bind(point);
  ShowMsg("监听成功");
  socketWatch.Listen(10);

  Thread th = new Thread(Listen)
  th.IsBackground = true;
  th.Start(socketWatch)
}

private void Listen(object o) {
  Socket socketWatch = o as Socket;
  while(true) {
    Socket socketSend = socketWatch.Accept();
    ShowMsg(socketSend.RemoteEndPoint.ToString())
  }
}
private void ShowMsg(string str) {

}
```
