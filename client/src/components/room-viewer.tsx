import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { PropertyRoom } from "@shared/schema";

interface RoomViewerProps {
  rooms: PropertyRoom[];
}

export default function RoomViewer({ rooms }: RoomViewerProps) {
  const [selectedRoom, setSelectedRoom] = useState<PropertyRoom>(rooms[0]);

  const getRoomIcon = (type: string) => {
    switch (type) {
      case 'living_room':
        return '🛋️';
      case 'kitchen':
        return '🍽️';
      case 'bedroom':
        return '🛏️';
      case 'bathroom':
        return '🛁';
      case 'dining_room':
        return '🍴';
      case 'study':
        return '📚';
      default:
        return '🏠';
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-video w-full">
        <img 
          src={selectedRoom.image} 
          alt={selectedRoom.name}
          className="w-full h-80 object-cover rounded-lg"
        />
      </div>
      
      {/* Room Navigation */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {rooms.map((room) => (
          <Button
            key={room.id}
            onClick={() => setSelectedRoom(room)}
            variant={selectedRoom.id === room.id ? "default" : "outline"}
            className={`flex-shrink-0 ${
              selectedRoom.id === room.id 
                ? 'grass-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:grass-100'
            }`}
          >
            <span className="mr-2">{getRoomIcon(room.type)}</span>
            {room.name}
          </Button>
        ))}
      </div>
      
      {/* Room Details */}
      <Card className="bg-grass-50">
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-2">{selectedRoom.name}</h4>
          {selectedRoom.description && (
            <p className="text-gray-600 mb-2">{selectedRoom.description}</p>
          )}
          {selectedRoom.dimensions && (
            <p className="text-sm text-grass-700">
              <strong>Dimensions:</strong> {selectedRoom.dimensions}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
