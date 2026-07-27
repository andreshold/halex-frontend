import avatar from '../assets/halex_avatar.png'

export default function AvatarHalex() {
  return (
    <div className="relative mt-0.5 h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-gold-400 bg-white">
      <img src={avatar} alt="" className="h-full w-full object-cover" />
    </div>
  )
}
