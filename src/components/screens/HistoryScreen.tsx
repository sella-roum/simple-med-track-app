import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface HistoryRecord {
  id: string;
  date: string;
  time: string;
  medication: string;
  dosage: string;
  memo: string;
}

export const HistoryScreen = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [historyData, setHistoryData] = useState<HistoryRecord[]>([]);
  const { toast } = useToast();

  // サンプル履歴データ
  const sampleHistory: HistoryRecord[] = [
    {
      id: '1',
      date: '2024-05-29',
      time: '08:30',
      medication: 'ロキソニン錠60mg',
      dosage: '1錠',
      memo: '食後に服用'
    },
    {
      id: '2',
      date: '2024-05-29',
      time: '12:30',
      medication: 'ガスター錠20mg',
      dosage: '1錠',
      memo: ''
    },
    {
      id: '3',
      date: '2024-05-28',
      time: '20:00',
      medication: 'ムコダイン錠250mg',
      dosage: '3錠',
      memo: '就寝前'
    },
  ];

  const handleSearch = () => {
    if (!startDate || !endDate) {
      toast({
        title: "エラー",
        description: "開始日と終了日を選択してください。",
        variant: "destructive",
      });
      return;
    }

    // 実際の実装ではAPIを呼び出して履歴を取得
    setHistoryData(sampleHistory);
    
    toast({
      title: "履歴表示",
      description: "指定期間の履歴を表示しました。",
    });
  };

  const handleEdit = (recordId: string) => {
    toast({
      title: "編集機能",
      description: "編集ダイアログを実装予定です。",
    });
  };

  const handleDelete = (recordId: string) => {
    toast({
      title: "削除機能",
      description: "削除確認ダイアログを実装予定です。",
    });
  };

  // 日付ごとにグループ化
  const groupedHistory = historyData.reduce((groups, record) => {
    const date = record.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {} as { [key: string]: HistoryRecord[] });

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            服薬履歴検索
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                開始日
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                終了日
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleSearch}
            className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            表示
          </Button>
        </CardContent>
      </Card>

      {Object.keys(groupedHistory).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              服薬履歴
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(groupedHistory).map(([date, records]) => (
                <div key={date} className="space-y-3">
                  <h3 className="font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    {new Date(date).toLocaleDateString('ja-JP', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      weekday: 'short'
                    })}
                  </h3>
                  
                  <div className="space-y-3">
                    {records.map((record) => (
                      <Card key={record.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {record.time}
                              </Badge>
                              <span className="font-medium text-gray-800">
                                {record.medication}
                              </span>
                            </div>
                            
                            <div className="text-sm text-gray-600">
                              <span>服用量: {record.dosage}</span>
                              {record.memo && (
                                <span className="ml-4">メモ: {record.memo}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(record.id)}
                            >
                              編集
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(record.id)}
                            >
                              削除
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
