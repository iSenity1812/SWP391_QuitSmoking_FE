import { useState, useEffect, useRef } from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng'
import type {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
  IRemoteVideoTrack
} from 'agora-rtc-sdk-ng'
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VideoCallProps {
  appId: string;
  channelName: string;
  token: string;
  uid: string;
}

export function VideoCall({ appId, channelName, token, uid }: VideoCallProps) {
  const client = useRef<IAgoraRTCClient | null>(null)
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([])
  const [localTracks, setLocalTracks] = useState<[IMicrophoneAudioTrack, ICameraVideoTrack] | null>(null)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isJoining, setIsJoining] = useState(true)


  // khởi tạo client và tham gia kênh
  useEffect(() => {
    if (!appId || !channelName || !token || !uid) {
      console.error('Missing required parameters for video call')
      return
    }

    const initAgora = async () => {
      client.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

      // Lắng nghe sự kiện người dùng được published
      const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
        await client.current?.subscribe(user, mediaType)
        if (mediaType === 'video') {
          setRemoteUsers((prevUsers) => [...prevUsers, user])
        }
      }

      // Lắng nghe sự kiện người dùng rời khỏi kênh
      const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
        setRemoteUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid))
      }

      // Khởi tạo client
      client.current.on('user-published', handleUserPublished)
      client.current.on('user-left', handleUserLeft)

      try {
        await client.current.join(appId, channelName, token, uid) // Tham gia kênh
        const tracks = await AgoraRTC.createMicrophoneAndCameraTracks() // Tạo các track âm thanh và video
        setLocalTracks(tracks) // Lưu các track cục bộ
        await client.current.publish(tracks) // Phát các track cục bộ lên kênh
        setIsJoining(false) // Đặt trạng thái tham gia là false khi đã tham gia thành công
      } catch (error) {
        console.error('Error joining channel:', error)
        setIsJoining(false) // Đặt trạng thái tham gia là false nếu có lỗi
      }
    }

    initAgora()

    return () => {
      localTracks?.[0].close() // Đóng track âm thanh
      localTracks?.[1].close() // Đóng track video
      client.current?.leave() // Rời khỏi kênh
      client.current?.removeAllListeners() // Xóa tất cả các listener
    }
  }, [appId, channelName, token, uid])

  // Tắt/mở mic
  const handleToggleMic = async () => {
    if (localTracks?.[0]) {
      await localTracks[0].setEnabled(!isMicOn) // Chuyển đổi trạng thái mic
      setIsMicOn(!isMicOn) // Cập nhật trạng thái mic
    }
  }

  // Tắt/mở video
  const handleToggleVideo = async () => {
    if (localTracks?.[1]) {
      await localTracks[1].setEnabled(!isVideoOn) // Chuyển đổi trạng thái video
      setIsVideoOn(!isVideoOn) // Cập nhật trạng thái video
    }
  }

  const handleLeaveCall = async () => {
    if (client.current) {
      await client.current.leave() // Rời khỏi kênh
      setLocalTracks(null) // Đặt lại các track cục bộ
      setRemoteUsers([]) // Xóa danh sách người dùng từ xa
      setIsJoining(false) // Đặt trạng thái tham gia là false
    }
  }

  const VideoPlayer = ({ track }: { track: ICameraVideoTrack | IRemoteVideoTrack | undefined }) => {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (ref.current && track) {
        track.play(ref.current); // Phát video vào phần tử div
      }
      return () => {
        track?.stop(); // Dừng phát video khi component unmount
      }
    }, [track]);
    return <div ref={ref} className="w-full h-full bg-black rounded-lg overflow-hidden"></div>;
  }


  // Render giao diện video call
  if (isJoining) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-white">
        < Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-lg">Đang kết nối vào cuộc gọi...</p>
      </div >
    )
  }

  return (
    <div className="h-screen w-screen bg-slate-900 flex flex-col relative">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* localVideo */}
        <div id="local-player" className="bg-black rounded-lg overflow-hidden relative">
          <p className="absolute top-2 left-2 z-10 bg-black/50 text-white px-2 py-1 rounded">Bạn</p>
          {localTracks && <VideoPlayer track={localTracks[1]} />}
        </div>

        {/* Remote Users */}
        {remoteUsers.map((user) => (
          <div key={user.uid} id={`remote-player-${user.uid}`} className="bg-black rounded-lg overflow-hidden relative">
            <p className="absolute top-2 left-2 z-10 bg-black/50 text-white px-2 py-1 rounded">Đối tác</p>
            {user.videoTrack && <VideoPlayer track={user.videoTrack} />}
          </div>
        ))}

        {/* Control */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center p-4 bg-black/30">
          <div className="flex space-x-4">
            <Button onClick={handleToggleMic} variant={isMicOn ? 'secondary' : 'destructive'} size="lg" className="rounded-full w-16 h-16">
              {isMicOn ? <Mic /> : <MicOff />}
            </Button>
            <Button onClick={handleToggleVideo} variant={isVideoOn ? 'secondary' : 'destructive'} size="lg" className="rounded-full w-16 h-16">
              {isVideoOn ? <Video /> : <VideoOff />}
            </Button>
            <Button onClick={handleLeaveCall} variant="destructive" size="lg" className="rounded-full w-16 h-16">
              <PhoneOff />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}