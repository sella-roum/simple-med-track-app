
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Search, Calendar, Edit, Trash2, Clock } from 'lucide-react';

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

  // 本日の日付をデフォルト値として設定
  useEffect(() => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    setStartDate(todayString);
    setEndDate(todayString);
  }, []);

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
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">服薬履歴</h2>
        <p className="text-gray-600">過去の服薬記録を確認できます</p>
      </div>

      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Search className="w-5 h-5" />
            検索条件
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
              <Label htmlFor="startDate" className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-green-500" />
                開始日
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-green-200 focus:border-green-500"
              />
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
              <Label htmlFor="endDate" className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-green-500" />
                終了日
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border-green-200 focus:border-green-500"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleSearch}
            className="w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Search className="w-4 h-4 mr-2" />
            検索して表示
          </Button>
        </CardContent>
      </Card>

      {Object.keys(groupedHistory).length > 0 && (
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5" />
              服薬履歴一覧
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {Object.entries(groupedHistory).map(([date, records]) => (
                <div key={date} className="space-y-3">
                  <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                    <Calendar className="w-5 h-5 text-indigo-500" />
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {new Date(date).toLocaleDateString('ja-JP', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {records.map((record) => (
                      <Card key={record.id} className="p-5 hover:shadow-md transition-all duration-200 border-l-4 border-l-indigo-400 bg-gradient-to-r from-white to-indigo-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center space-x-3">
                              <Badge variant="outline" className="text-xs bg-indigo-100 text-indigo-700 border-indigo-200">
                                <Clock className="w-3 h-3 mr-1" />
                                {record.time}
                              </Badge>
                              <span className="font-medium text-gray-800 text-lg">
                                {record.medication}
                              </span>
                            </div>
                            
                            <div className="text-sm text-gray-600 flex flex-wrap gap-4">
                              <span className="flex items-center gap-1">
                                <strong>服用量:</strong> {record.dosage}
                              </span>
                              {record.memo && (
                                <span className="flex items-center gap-1">
                                  <strong>メモ:</strong> {record.memo}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(record.id)}
                              className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              編集
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(record.id)}
                              className="hover:bg-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
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
